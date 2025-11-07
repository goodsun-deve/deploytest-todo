# Simple Todo (Korean)

간단하고 깔끔한 테스트용 Todo 웹앱입니다. 정적 파일 3개(HTML/CSS/JS)로 구성되며, 데이터는 브라우저 `localStorage`에만 저장됩니다.

## 실행 방법
- 방법 1: `index.html` 파일을 더블클릭해서 브라우저로 열기
- 방법 2: 간단한 정적 서버에서 열기 (선택)
  - Python 3: `python -m http.server 8000` 후 `http://localhost:8000` 접속
  - Node(serve 등): `npx serve .` 후 안내 주소 접속

## 주요 기능
- 할 일 추가/완료/삭제
- 제목 인라인 편집 (Enter로 저장, Esc로 취소, 포커스 아웃 시 저장)
- 필터: 전체 / 미완료 / 완료
- 완료 항목 일괄 삭제
- 미완료 개수 표시
- 자동 저장(localStorage)

## 파일 구성
- `index.html` – 마크업과 기본 구조
- `styles.css` – 다크 테마 기반의 간단한 스타일
- `app.js` – 상호작용 및 저장 로직

## 메모
- 서버/DB는 없습니다. 브라우저 캐시를 지우면 데이터도 초기화됩니다.
- 필요 시 다국어, 키보드 단축키, 드래그 정렬 등 확장 가능합니다.
