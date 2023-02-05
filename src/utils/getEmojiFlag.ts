/**
 * @file Contains the function `getEmojiFlag` that converts country codes to emoji flags
 */

// https://gist.github.com/RienNeVaPlus/307d19b1c33fbb2545eca5c83d3bad83

/**
 * 🏁 Returns an unicode-emoji-flag-icon for a two digit country code or a locale (eg. en-US)
 * - Supports 239 countries
 *
 * @param {String} countryCode - the country code to display a flag for (eg. US)
 * @param {String} [fallback=🏳] - fallback icon when no matching flag has been found
 * @param {Object} [countryFlagData] - an object of country code : flag
 */
export function getEmojiFlag(countryCode: string, fallback: string = '🏳', countryFlagData: {[key: string]: string} = {
	AD: '🇦🇩', AE: '🇦🇪', AF: '🇦🇫', AG: '🇦🇬', AI: '🇦🇮', AL: '🇦🇱', AM: '🇦🇲', AO: '🇦🇴', AQ: '🇦🇶', AR: '🇦🇪',
	AS: '🇦🇸', AT: '🇦🇹', AU: '🇦🇺', AW: '🇦🇼', AX: '🇦🇽', AZ: '🇦🇿', BA: '🇧🇦', BB: '🇧🇧', BD: '🇧🇩', 
	BF: '🇧🇫', BG: '🇧🇬', BH: '🇧🇭', BI: '🇧🇮', BJ: '🇧🇯', BL: '🇧🇱', BM: '🇧🇲', BN: '🇧🇳', BO: '🇧🇴', BQ: '🇧🇶',
	BR: '🇧🇷', BS: '🇧🇸', BT: '🇧🇹', BV: '🇧🇻', BW: '🇧🇼', BY: '🇧🇾', BZ: '🇧🇿', CA: '🇨🇦', CC: '🇨🇨', CD: '🇨🇩',
	CF: '🇨🇫', CG: '🇨🇬', CH: '🇨🇭', CI: '🇨🇮', CK: '🇨🇰', CL: '🇨🇱', CM: '🇨🇲', CN: '🇨🇳', CO: '🇨🇴', CR: '🇨🇷',
	CU: '🇨🇺', CV: '🇨🇻', CW: '🇨🇼', CX: '🇨🇽', CY: '🇨🇾', CZ: '🇨🇿', DE: '🇩🇪', DJ: '🇩🇯', DK: '🇩🇰', DM: '🇩🇲',
	DO: '🇩🇴', DZ: '🇩🇿', EC: '🇪🇨', EE: '🇪🇪', EG: '🇪🇬', EH: '🇪🇭', ER: '🇪🇷', ES: '🇪🇸', ET: '🇪🇹', FI: '🇫🇮',
	FJ: '🇫🇯', FK: '🇫🇰', FM: '🇫🇲', FO: '🇫🇴', FR: '🇫🇷', GA: '🇬🇦', GB: '🇬🇧', GD: '🇬🇩', GE: '🇬🇪', GF: '🇬🇫',
	GG: '🇬🇬', GH: '🇬🇭', GI: '🇬🇮', GL: '🇬🇱', GM: '🇬🇲', GN: '🇬🇳', GP: '🇬🇵', GQ: '🇬🇶', GR: '🇬🇷', GS: '🇬🇸',
	GT: '🇬🇹', GU: '🇬🇺', GW: '🇬🇼', GY: '🇬🇾', HK: '🇭🇰', HM: '🇭🇲', HN: '🇭🇳', HR: '🇭🇷', HT: '🇭🇹', HU: '🇭🇺',
	ID: '🇮🇩', IE: '🇮🇪', IL: '🇮🇱', IM: '🇮🇲', IN: '🇮🇳', IO: '🇮🇴', IQ: '🇮🇶', IR: '🇮🇷', IS: '🇮🇸', IT: '🇮🇹',
	JE: '🇯🇪', JM: '🇯🇲', JO: '🇯🇴', JP: '🇯🇵', KE: '🇰🇪', KG: '🇰🇬', KH: '🇰🇭', KI: '🇰🇮', KM: '🇰🇲', KN: '🇰🇳',
	KP: '🇰🇵', KR: '🇰🇷', KW: '🇰🇼', KY: '🇰🇾', KZ: '🇰🇿', LA: '🇱🇦', LB: '🇱🇧', LC: '🇱🇨', LI: '🇱🇮', LK: '🇱🇰',
	LR: '🇱🇷', LS: '🇱🇸', LT: '🇱🇹', LU: '🇱🇺', LV: '🇱🇻', LY: '🇱🇾', MA: '🇲🇦', MC: '🇲🇨', MD: '🇲🇩', ME: '🇲🇪',
	MF: '🇲🇫', MG: '🇲🇬', MH: '🇲🇭', MK: '🇲🇰', ML: '🇲🇱', MM: '🇲🇲', MN: '🇲🇳', MO: '🇲🇴', MP: '🇲🇵', MQ: '🇲🇶',
	MR: '🇲🇷', MS: '🇲🇸', MT: '🇲🇹', MU: '🇲🇺', MV: '🇲🇻', MW: '🇲🇼', MX: '🇲🇽', MY: '🇲🇾', MZ: '🇲🇿', NA: '🇳🇦',
	NC: '🇳🇨', NE: '🇳🇪', NF: '🇳🇫', NG: '🇳🇬', NI: '🇳🇮', NL: '🇳🇱', NO: '🇳🇴', NP: '🇳🇵', NR: '🇳🇷', NU: '🇳🇺',
	NZ: '🇳🇿', OM: '🇴🇲', PA: '🇵🇦', PE: '🇵🇪', PF: '🇵🇫', PG: '🇵🇬', PH: '🇵🇭', PK: '🇵🇰', PL: '🇵🇱', PM: '🇵🇲',
	PN: '🇵🇳', PR: '🇵🇷', PS: '🇵🇸', PT: '🇵🇹', PW: '🇵🇼', PY: '🇵🇾', QA: '🇶🇦', RE: '🇷🇪', RO: '🇷🇴', RS: '🇷🇸',
	RU: '🇷🇺', RW: '🇷🇼', SB: '🇸🇧', SC: '🇸🇨', SD: '🇸🇩', SE: '🇸🇪', SG: '🇸🇬', SH: '🇸🇭', SI: '🇸🇮',
	SJ: '🇸🇯', SK: '🇸🇰', SL: '🇸🇱', SM: '🇸🇲', SN: '🇸🇳', SO: '🇸🇴', SR: '🇸🇷', SS: '🇸🇸', ST: '🇸🇹', SV: '🇸🇻',
	SX: '🇸🇽', SY: '🇸🇾', SZ: '🇸🇿', TC: '🇹🇨', TD: '🇹🇩', TF: '🇹🇫', TG: '🇹🇬', TH: '🇹🇭', TJ: '🇹🇯', TK: '🇹🇰',
	TL: '🇹🇱', TM: '🇹🇲', TN: '🇹🇳', TO: '🇹🇴', TR: '🇹🇷', TT: '🇹🇹', TV: '🇹🇻', TW: '🇹🇼', TZ: '🇹🇿', UA: '🇺🇦',
	UG: '🇺🇬', UM: '🇺🇲', US: '🇺🇸', UY: '🇺🇾', UZ: '🇺🇿', VA: '🇻🇦', VC: '🇻🇨', VE: '🇻🇪', VG: '🇻🇬', 
	VN: '🇻🇳', VU: '🇻🇺', WF: '🇼🇫', WS: '🇼🇸', XK: '🇽🇰', YE: '🇾🇪', YT: '🇾🇹', ZA: '🇿🇦', ZM: '🇿🇲', 
    /** Manually linking some flags to language shortcodes */
    EN: '🇬🇧', CS: '🇨🇿', FA: '🇮🇷', HI: '🇮🇳', SA: '🇮🇳', JA: '🇯🇵', KO: '🇰🇷', UK: '🇺🇦', VI: '🇻🇳', ZH: '🇨🇳', BE: '🇧🇾'
}){
	const arr = countryCode.split('-');
	return countryFlagData[(arr[1] || arr[0]).toUpperCase()] || fallback;
}