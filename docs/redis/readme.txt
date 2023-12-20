 ....................................LỆNH CƠ BẢN TRONG REDIS.............................................

1. redis string

2. redis hash (cấu trúc giống object) - sử dụng kịch bản giỏ hàng 
  Lệnh cơ bản: HSET, HGET, HGETALL, HKEYS HVALS, HDEL, HLEN, HINCR, HINCRBY

3. redis list: (linked list)
  - Cấu trúc: cấu trúc liên kết - nối với nhau bởi các node, có con trỏ head và tail
  - xử lý job queue (FIFO): RPUSH, LPOP
  - xử lý stack (FILO): LPUSH, LPOP
  - lấy danh sách tất cả các phần tử trong list: LLRANGE key 0 -1 (0 là phần tử đầu, -1 là phần tử cuối)

  ***** Quan trọng **********
  - cơ chế blocking của list:
    + nếu ko tìm thấy message nào trong queue nó sẽ đợi cho tới khi tìm được phần tử: BLPOP key timeout
    + nếu tìm tháy message: nó sẽ lấy ra phần tử đầu tiên
    + đê tuân theo đúng thứ tự hãy sử dụng RPUSH để thêm data vào cuối mảng
  ****************

4. redis sets
  - không có thứ tự, không có phần tử trùng nhau
  - lệnh cơ bản:
    + SADD key: thêm phần tử vào sets
    + SMEMBERS key: danh sách phần tử
    + SREM key element: xóa phần tử, nhưng ko lấy đc gía trị
    + SISMEMBER key element: kiểm tra phần tử có tồn tại trong key
    + SRANDMEMBER key n: gọi random n phần tử
    + SPOP key element: xóa phần tử nhưng lấy được giá trị
    + SMOVE key new_key  element: chuyển phần tử từ sets cũ qua sets mới
    + SCARD key: đếm tổng số phần tử
  - kịch bản sử dụng:
    + chức năng like: đã like rồi ko thể like lại nữa, chỉ có unlike thôi
    + tìm bạn chung(sản phẩm chung) hoặc gợi ý kết bạn fb: 
       . SINTER key1 key2: tìm giá trị chung của 2 key
       . SDIFF key1 key2: giá trị mà key1 có mà key2 không có
         SDIFF key2 key1: giá trị mà key2 có mà key1 không có

5. redis zset
  - tương tự như set nhưng có sắp xếp thứ tự
  - Kịch bản sử dụng: xếp hạng sản phẩm, mặt hàng bán chạy, ...
  - Lệnh cơ bản:
    + ZADD key score element; score la kieu number, element la kieu text
    + ZREVRANGE key 0 -1: lấy tất cả phần tử  theo thứ tự giảm dần
    + ZRANGE key 0 -1: lấy tất cả phần tử  theo thứ tự tăng dần
    + ZRANGEBYSCORE key score1 score2: lấy các phần tử có score trong khoảng score1 đến score2
    + ZRANGEBYSCORE key score1 score2 WITHSCORES: lấy các phần tử có score trong khoảng score1 đến score2, có trả ra cả score đính kèm
    + ZSCORE key element: lấy điểm của element
    + ZINCRYBY key score element: cộng giá trị của element hiện tại
    + ZREM key element: xóa 1 phần tử khỏi zset

....................................TRANSACTION.............................................

1. MULTI: bắt đầu 1 transaction trên 1 instance mới
  Lưu ý: Tất cả các lệnh trong 1 transaction sẽ được gửi vào QUEUE

2. EXEC: Kết thúc 1 transaction, các lệnh trong transaction tới lúc này mới được thực thi
  Lưu ý: 
    Trong 1 transaction:
      + nếu có bất kì 1 lệnh nào sai syntax thì sau khi thực thi EXEC, transaction đó sẽ bị hủy bỏ
      + nếu có lệnh nào sai về mặt logic thì sau khi thực EXEC, lệnh sai đó sẽ bị loại bỏ và có report thông báo lỗi, các lệnh đúng khác vẫn thực hiện bình thường

3. DISCARD: hủy bỏ 1 transaction

4. WATCH: theo dõi 1 biến trong transaction, nếu trong transaction đã làm thay đổi giá trị biến đó mà, ở 1 instance không phải transaction cũng làm thay đổi giá trị biến đó thì giá trị thay đổi ở transaction sẽ bị hủy bỏ.
  Cú pháp sử dụng: 

    Bước 1:
      SET key 2000 
      WATCH key
    Bước 2: 
      MULTI
    Bước 3: 
      (trường hợp ví dụ) INCRY key -1000 (nếu thực thi EXEC thì giá trị key lúc này là 1000)
    Bước 4: 
      Ở 1 instance khác, tôi sử dụng: SET key 3000
      => Câu lệnh: "INCRY key 1000" trong transaction sẽ bị hủy bỏ nếu thực hiện EXEC, và giá trị của key là 3000
  
  *******Lưu ý (đê tránh gặp lỗi)*******************************ub
  
    - Lệnh sử dụng watch và multi phải cùng nằm trong 1 instance
  **************************************************************
  Trường hợp sử dụng: transaction đang cập nhật hàng tồn kho, thì có 1 lệnh nhập kho vào, transaction cập nhật số lượng tồn kho sẽ bị loại bỏ

............................................PUB/SUB.......................................
 
- Trường hợp cụ thể như sau:
  Một sản phẩm hết hàng, người dùng đăng ký nhận thông báo khi sản phẩm còn hàng trở lại
- Hướng xử lý:
  + Người dùng đăng ký: subscribe channel (channel là mã sản phẩm chẳng hạn)
  + Khi sản phẩm được nhập hàng: publish channel
      => lúc này những người đăng ký sẽ nhận được message 