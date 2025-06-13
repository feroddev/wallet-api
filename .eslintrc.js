module.exports = {
	"parser": "@typescript-eslint/parser",
	"plugins": ["@typescript-eslint", "prettier"],
	"extends": [
		"@bankme-tech/eslint-config-pattern",
		"plugin:prettier/recommended"
	],
	"rules": {
		"@typescript-eslint/naming-convention": ["off"],
		"unused-imports/no-unused-imports": "error"
	}
}
