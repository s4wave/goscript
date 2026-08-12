package gotest

import (
	"strings"
	"testing"
)

func TestRequestNormalizeBrowserContract(t *testing.T) {
	tests := []struct {
		name    string
		backend RuntimeBackend
		browser BrowserName
		want    BrowserName
		wantErr string
	}{
		{name: "bun omits browser", backend: RuntimeBackendBun},
		{name: "chromium", backend: RuntimeBackendBrowser, browser: BrowserNameChromium, want: BrowserNameChromium},
		{name: "webkit", backend: RuntimeBackendBrowser, browser: BrowserNameWebKit, want: BrowserNameWebKit},
		{name: "browser requires engine", backend: RuntimeBackendBrowser, wantErr: "browser name is required"},
		{name: "unknown engine", backend: RuntimeBackendBrowser, browser: BrowserName("firefox"), wantErr: "unsupported browser name"},
		{name: "bun rejects engine", backend: RuntimeBackendBun, browser: BrowserNameChromium, wantErr: "browser name requires browser runtime backend"},
	}
	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			norm, err := (&Request{
				Patterns:       []string{"."},
				RuntimeBackend: test.backend,
				Browser:        test.browser,
			}).normalize()
			if test.wantErr != "" {
				if err == nil || !strings.Contains(err.Error(), test.wantErr) {
					t.Fatalf("normalize() error = %v, want %q", err, test.wantErr)
				}
				return
			}
			if err != nil {
				t.Fatalf("normalize() failed: %v", err)
			}
			if norm.Browser != test.want {
				t.Fatalf("browser = %q, want %q", norm.Browser, test.want)
			}
		})
	}
}
