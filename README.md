# Acon3d-api 0.1 ver.

## 1. API 개요
Acon3d-api 0.1 ver.은 Node.js, express를 활용하여 구현되었습니다. 상품 내역 및 계정 정보는 mongoDB로 연동하여 저장하였습니다.



## 2. 주요 기술 스택
- Node.js
- Express
- MongoDB
- Handlebar



## 3. API 명세
### 메인페이지
1. GET | '/'                         메인페이지

### 회원 가입 및 로그인
1. GET  | '/api/auth/register'       회원가입
2. POST | '/api/auth/register'       회원가입 전송
3. GET  | '/api/auth/signin'         로그인
4. POST | '/api/auth/signin'         로그인 전송
5. GET  | '/api/auth/:id'            로그인 완료, 프로필 출력


### 회원정보
1. GET    | '/api/users/:id'          회원정보 출력, 관리자만 전체 출력
2. PUT    | '/api/users/:id'          회원정보 수정
3. DELETE | '/api/users/:id'          회원정보 삭제


### 작가모드
1. GET    | '/api/products'        검토 요청 페이지 출력, 작가 본인 것만 출력
2. POST   | '/api/products'        검토 요청 페이지 전송
3. GET    | '/api/products/:id'    페이지 수정 출력
4. PUT    | '/api/products/:id'    페이지 수정 전송
5. DELETE | '/api/products/:id'    페이지 삭제


### 관리자모드
1. GET    | '/api/select'             검토 요청 페이지 출력, 작가 전체 출력
2. GET    | '/api/select/list'        검토 요청 페이지 출력
3. POST   | '/api/select/:id'         검토 완료 페이지 전송
4. PUT    | '/api/select/:id'         페이지 수정 전송
5. DELETE | '/api/select/:id'         페이지 삭제


### 고객모드
1. GET    | '/api/items'              검토가 완료된 아이템만 출력



## 4. 기능
### 작가
- 작가는 writer 계정으로 로그인하여 사용할 수 있습니다.
- 작가는 상품과 관련한 정보를 작성하여 에디터에게 '상품 리스트에 추가 요청'을 할 수 있습니다.
- 상품과 관련한 정보는 다음과 같습니다.
  - 제목, 본문, 판매가격

### 에디터
- 에디터는 editor 계정으로 로그인 후 API에 접근할 수 있습니다.
- 에디터는 작가가 요청한 상품 리스트 추가 요청 명세를 확인한 후 commission을 추가할 수 있습니다.
- 에디터가 승인한 상품은 상품 리스트에 출력됩니다.

### 고객
- 고객은 customer 계정으로 로그인하여 서비스를 이용할 수 있습니다.
- 고객은 상품을 조회할 수 있습니다.
