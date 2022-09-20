/**
 * @file Contains global type definitions.
 */

/**
 * Disable emoji-mart typing warnings.
 */
// TODO: Remove when https://github.com/missive/emoji-mart/issues/576 is merged.
declare module "@emoji-mart/react";

/**
 * Extend Navigator with extra types.
 *
 * @description Define NetworkInformation attribute types. Needed since they are not yet supported (see
 * https://stackoverflow.com/a/69676260/8135687). Taken from
 * https://github.com/lacolaco/network-information-types/blob/master/index.d.ts
 */
declare interface Navigator extends NavigatorNetworkInformation {}

// http://wicg.github.io/netinfo/#navigatornetworkinformation-interface
declare interface NavigatorNetworkInformation {
  readonly connection?: NetworkInformation;
}

// http://wicg.github.io/netinfo/#effectiveconnectiontype-enum
type EffectiveConnectionType = "2g" | "3g" | "4g" | "slow-2g";

// http://wicg.github.io/netinfo/#dom-megabit
type Megabit = number;
// http://wicg.github.io/netinfo/#dom-millisecond
type Millisecond = number;

// http://wicg.github.io/netinfo/#networkinformation-interface
interface NetworkInformation extends EventTarget {
  // readonly type?: ConnectionType; // NOTE: Already included in upstream https://github.com/microsoft/TypeScript/blob/main/lib/lib.dom.d.ts#L10430.
  // http://wicg.github.io/netinfo/#effectivetype-attribute
  readonly effectiveType?: EffectiveConnectionType;
  // http://wicg.github.io/netinfo/#downlinkmax-attribute
  readonly downlinkMax?: Megabit;
  // http://wicg.github.io/netinfo/#downlink-attribute
  readonly downlink?: Megabit;
  // http://wicg.github.io/netinfo/#rtt-attribute
  readonly rtt?: Millisecond;
  // http://wicg.github.io/netinfo/#savedata-attribute
  readonly saveData?: boolean;
  // http://wicg.github.io/netinfo/#handling-changes-to-the-underlying-connection
  onchange?: EventListener;
}
