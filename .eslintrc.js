module.exports = {
    env: {
        browser: true,
        es2021: true
    },
    extends: [
        'standard'
    ],
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module'
    },
    rules: {
        indent: ['error', 4],
        'no-useless-constructor': 'off',
        'no-new': 'off',
        semi: [2, 'always']
    }
};
