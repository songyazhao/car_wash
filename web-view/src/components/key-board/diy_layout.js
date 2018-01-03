export default {
	_meta: {
		"default": { keySet: "default", text: "abc", classes: "control"},
		"alpha": { keySet: "default", text: "Abc", classes: "control"},
		"caps": { keySet: "capsed", text: "⇧", classes: "control activated"},
		"numbers": { keySet: "numbers", text: "123", classes: "control"},
		"space": { key: "", text: "空格", width: 200},
		"point": { key: "", text: "."},
		"backspace": { func: "backspace", classes: "control"},
		"accept": { func: "accept", text: "确定", classes: "control featured"},
		"zero": { key: "0", width: 130}
	},

	default: [
		"Q W E R T Y U I O P",
		" A S D F G H J K L ",
		"  Z X C V B N M {backspace}",
		// "{caps} Z X C V B N M {backspace}",
		"{numbers} {space} {accept}"
	],

	capsed: [
		"q w e r t y u i o p",
		" a s d f g h j k l ",
		"{caps} z x c v b n m {backspace}",
		"{numbers} {space} {accept}"
	],

	numbers: [
		"1 2 3",
		"4 5 6",
		"7 8 9",
		"{alpha} {point} {zero} {backspace} {accept}"
	]
}
