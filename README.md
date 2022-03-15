# Markup-template

## Environment
| Package | Version|
| - | - |
| node | 16.14.0 |
| npm | 8.5.3 |

## Recommend
- エディターはVisual Studio Codeを推奨。
### 推奨する拡張機能
- Stylelint : https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint
- ESlint : https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint
- Prettier : https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode

## Setup
- package-lock.jsonからnode_modulesのインストール。
```
$ npm ci
```

## Scripts
### ローカルサーバー起動
```
$ npm start
```

### ビルド
- ビルドコマンド実行時に、Stylelint、Eslint、Prettierを実行。
- Lintに問題がなかったら、distの生成。
```
$ npm run build
```

### Stylelint
```
$ npm run stylelint
```

### Eslint
- tscによる型チェックも実行
```
$ npm run lint
```
