# devserver
긴급히 웹 서버가 필요할 때 유-용!

## 제공하는 기능
* root 경로로 접근 시 index.html 제공
* javascript, css, jpg, png 파일 제공
* 500, 404 오류 화면 제공

## 설정
`run.js`의 webServerPort를 수정해서 쓰시면 됩니다.
```javascript
import run from "./dist/run.js";
run({
  webServerPort: 8413,
});
```

## 실행
```
node run.js
```

## NPM으로 설치 및 실행
[NPM](https://www.npmjs.com)으로도 설치 및 실행할 수 있습니다. 단, 이 경우 포트를 변경할 수 없고 기본 포트인 8413 포트를 사용해야 합니다.
```
npm install @yjgaia/devserver -g
```
```
devserver
```

## 라이센스
[MIT](LICENSE)

## 작성자
[Young Jae Sim](https://github.com/Hanul)