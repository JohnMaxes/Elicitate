- ngrok
ngrok là một tool để cho phép 1 cái url có https redirect sang cái backend của m
nói cách khác là cho nó public nhma trong lúc sử dụng url đó
nên là mở cmd, đừng cd đi đâu hết, npm install ngrok, hoặc đọc docs của nó
+ lệnh để làm cho localhost của m public qua 1 URL của ngrok: ngrok http (port)
=> nhma m phải register acc ngrok vs đưa nó token trc nên làm cái đó


- BACKEND
backend nằm trong folder BACKEND để trong project root của Elicitate, 
lấy cmd CD qua folder đó xong chạy npm start, cục server sẽ chạy, nhma chỉ là trên localhost thôi
=> sẽ phải vừa mở ngrok vừa mở BACKEND, 1 cmd global vs 1 cmd nội trong VSCode

+ app.js định nghĩa các root và environment, các endpoint nằm trong root
	> cứ lấy file index.js làm mẫu, code phải có require và export.module nhé
	> code xong có muốn xài thì vào app.js, require cái file .js đó rồi để lệnh app.use(desired url, var m ms require);
	> tao set port.env = 3000, m edit lại trong app.js cũng được

+ tất cả các config liên quan đến Firebase đã được config hết rồi (/config/Firebase.js), it works
	> require nó theo file login/register mẫu
	> các request m code để đi đến endpoint phải có đống param nằm ở body (1) và not JSON mà là theo xxx-url-encoded

+ tao cũng có code cái hàm tạo JWT nữa cho nó gọn, check docs nhé, login/signup tao đều trả về 1 jwt nhma mình chưa code được là làm gì vs nó, very possible là bỏ vô React Context


- Elicitate
+ Hình ảnh có thể được store dưới dạng base64, tức là biến từ mã base64 thành chữ real, có thể sử dụng để store vào db hay sao đó
+ React Context nên chứa: current-course, dark mode, noti enabled. tao k bt React Context có trường tồn hay k, nếu k thì cứ xài AsyncStorage, hỏi gpt về tgian tồn tại của nó nhé
+ Tao code db auto reset mỗi lần mở, so yeah

- Firebase
+ config hết r, backend copy ra r xài
+ Syntax trong docs, thích code gì vui vui thì code, nhma data duy user thôi, password tao hash nốt = hàm register rồi, login nó cũng có cái hàm riêng của hash để bt là thg hash1 vs thg hash2 có trùng nhau k rồi, check code backend
+ thích thì cứ tạo mới collection vs field, về sau thống nhất lại sau