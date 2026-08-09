export type {
  Addr,
  Buffers,
  Conn,
  Error,
  InvalidAddrError,
  Listener,
  PacketConn,
  UnknownNetworkError,
  buffersWriter,
  temporary,
  timeout,
} from './net.gs.js'
export type { Flags } from './interface.gs.js'
export type { HardwareAddr } from './mac.gs.js'
export type { IP, IPMask } from './ip.gs.js'
export type { addrList } from './ipsock.gs.js'
export type { byPref, byPriorityWeight } from './dnsclient.gs.js'
export type { fileAddr } from './file.gs.js'
export type { hostLookupOrder } from './dnsclient_unix.gs.js'
export type { mdnsTest } from './conf.gs.js'
export type { mptcpStatusDial, mptcpStatusListen } from './dial.gs.js'
export type { policyTable, scope } from './addrselect.gs.js'
export type { sockaddr } from './sockaddr_posix.gs.js'
export {
  AddrError,
  Buffers_Read,
  Buffers_WriteTo,
  Buffers_consume,
  DNSConfigError,
  DNSError,
  ErrClosed,
  ErrWriteToConnected,
  InvalidAddrError_Error,
  InvalidAddrError_Temporary,
  InvalidAddrError_Timeout,
  OpError,
  ParseError,
  UnknownNetworkError_Error,
  UnknownNetworkError_Temporary,
  UnknownNetworkError_Timeout,
  __goscript_set_ErrClosed,
  __goscript_set_ErrWriteToConnected,
  canceledError,
  conn,
  noReadFrom,
  noWriteTo,
  notFoundError,
  tcpConnWithoutReadFrom,
  tcpConnWithoutWriteTo,
  temporaryError,
  timeoutError,
} from './net.gs.js'
export {
  CIDRMask,
  IPMask_Size,
  IPMask_String,
  IPNet,
  IP_AppendText,
  IP_DefaultMask,
  IP_Equal,
  IP_IsGlobalUnicast,
  IP_IsInterfaceLocalMulticast,
  IP_IsLinkLocalMulticast,
  IP_IsLinkLocalUnicast,
  IP_IsLoopback,
  IP_IsMulticast,
  IP_IsPrivate,
  IP_IsUnspecified,
  IP_MarshalText,
  IP_Mask,
  IP_String,
  IP_To16,
  IP_To4,
  IP_UnmarshalText,
  IP_appendTo,
  IP_matchAddrFamily,
  IPv4,
  IPv4Mask,
  IPv4allrouter,
  IPv4allsys,
  IPv4bcast,
  IPv4len,
  IPv4zero,
  IPv6interfacelocalallnodes,
  IPv6len,
  IPv6linklocalallnodes,
  IPv6linklocalallrouters,
  IPv6loopback,
  IPv6unspecified,
  IPv6zero,
  ParseCIDR,
  ParseIP,
  __goscript_set_IPv4allrouter,
  __goscript_set_IPv4allsys,
  __goscript_set_IPv4bcast,
  __goscript_set_IPv4zero,
  __goscript_set_IPv6interfacelocalallnodes,
  __goscript_set_IPv6linklocalallnodes,
  __goscript_set_IPv6linklocalallrouters,
  __goscript_set_IPv6loopback,
  __goscript_set_IPv6unspecified,
  __goscript_set_IPv6zero,
} from './ip.gs.js'
export {
  DefaultResolver,
  LookupAddr,
  LookupCNAME,
  LookupHost,
  LookupIP,
  LookupMX,
  LookupNS,
  LookupPort,
  LookupSRV,
  LookupTXT,
  Resolver,
  __goscript_set_DefaultResolver,
  onlyValuesCtx,
} from './lookup.gs.js'
export {
  Dial,
  DialTimeout,
  Dialer,
  Listen,
  ListenConfig,
  ListenPacket,
  sysDialer,
  sysListener,
} from './dial.gs.js'
export {
  DialIP,
  IPAddr,
  IPConn,
  ListenIP,
  ResolveIPAddr,
} from './iprawsock.gs.js'
export {
  DialTCP,
  KeepAliveConfig,
  ListenTCP,
  ResolveTCPAddr,
  TCPAddr,
  TCPAddrFromAddrPort,
  TCPConn,
  TCPListener,
} from './tcpsock.gs.js'
export {
  DialUDP,
  ListenMulticastUDP,
  ListenUDP,
  ResolveUDPAddr,
  UDPAddr,
  UDPAddrFromAddrPort,
  UDPConn,
  addrPortUDPAddr,
} from './udpsock.gs.js'
export {
  DialUnix,
  ListenUnix,
  ListenUnixgram,
  ResolveUnixAddr,
  UnixAddr,
  UnixConn,
  UnixListener,
} from './unixsock.gs.js'
export {
  FileConn,
  FileListener,
  FilePacketConn,
  fileAddr_Network,
  fileAddr_String,
} from './file.gs.js'
export {
  FlagBroadcast,
  FlagLoopback,
  FlagMulticast,
  FlagPointToPoint,
  FlagRunning,
  FlagUp,
  Flags_String,
  Interface,
  InterfaceAddrs,
  InterfaceByIndex,
  InterfaceByName,
  Interfaces,
  ipv6ZoneCache,
} from './interface.gs.js'
export {
  JoinHostPort,
  SplitHostPort,
  ipStackCapabilities,
} from './ipsock.gs.js'
export {
  byRFC6724Info,
  ipAttr,
  policyTableEntry,
  policyTable_Classify,
} from './addrselect.gs.js'
export {
  deadlineTimer,
  fakeNetFD,
  fakeSockAddr,
  packet,
  packetQueue,
  packetQueueState,
} from './net_fake.gs.js'
export { HardwareAddr_String, ParseMAC } from './mac.gs.js'
export { MX, NS, SRV } from './dnsclient.gs.js'
export { Pipe, pipe, pipeAddr, pipeDeadline } from './pipe.gs.js'
export { byName } from './hosts.gs.js'
export { conf } from './conf.gs.js'
export { dnsConfig } from './dnsconfig.gs.js'
export { file } from './parse.gs.js'
export { hostLookupOrder_String, resolverConfig } from './dnsclient_unix.gs.js'
export { netFD, unknownAddr } from './fd_fake.gs.js'
export { nssConf, nssCriterion, nssSource, nsswitchConfig } from './nss.gs.js'
export { rawConn, rawListener } from './rawconn.gs.js'
import './lookup_unix.gs.js'
import './net.gs.js'
import './sockaddr_posix.gs.js'
