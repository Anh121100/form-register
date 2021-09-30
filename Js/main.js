
Validator ({
    form: '#form-register',
    errorSelector: '.form-message',
    rules: [
        Validator.isRequired('#fullname'),
        Validator.isFullname('#fullname', 'Vui lòng nhập họ tên đầy đủ') ,
        Validator.isRequired('#email'),
        Validator.isEmail('#email', 'Nhập lại email'),
        Validator.isRequired('#password'),
        Validator.checkPassword(
            "#password",
            "Mật khẩu phải chứa 8-32 ký tự, trong đó có ít nhất một chữ cái viết hoa, một chữ cái thường"
          ),
        Validator.isRequired('#password_confirmation'),
        Validator.isConfirmed('#password_confirmation', function(){
            return  document.querySelector('#form-register #password').value ;
        }, 'Xác nhận lại mật khẩu'),
    ],
    
})