function Validator(options){

    var selectorRules = {};

    // hàm xử lý xuất hiện message lỗi
    function validate (inputElement, rule) {
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
        var errorMessage ;
        var rules = selectorRules[rule.selector];

        for (var i =0; i<rules.length; ++i){
            errorMessage = rules[i](inputElement.value);
            if(errorMessage) break;
        }

        if (errorMessage) {
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add('invalid')
        } else {
            errorElement.innerText = '';
            inputElement.parentElement.classList.remove('invalid');
        }
        
        return !errorMessage;
    }


    // lấy element của form cần validate
    var formElement = document.querySelector(options.form);
    if(formElement) {

        // Lặp qua mỗi rule và xử lý
        options.rules.forEach(function (rule) {
            // Lưu lại các rules cho mỗi input
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            }
            else {
                selectorRules[rule.selector] = [rule.test];
            }

            var inputElement = formElement.querySelector(rule.selector);
          
            if (inputElement) {

                // Xử lý trường hợp blur khỏi input
                inputElement.onblur = function (){
                   validate(inputElement, rule);

                // xử lý mỗi khi người dùng nhập input
                inputElement.oninput = function () {
                    var errorElement = inputElement.parentElement.querySelector('.form-message');
                    errorElement.innerText = '';
                    inputElement.parentElement.classList.remove('invalid');
                }
            }
        }
        });
  
        // hành vi của nút submit
        formElement.onsubmit = function (e) {
            // loại bỏ hành vi mặc định của nut đăng ký
            e.preventDefault();

            var isFormValid = true;

            options.rules.forEach(function (rule){
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement, rule);

                if(!isValid) {
                    isFormValid = false;
                }
            });
            
            if(isFormValid) {
                alert('Đăng ký thành công');
            } 
        }
    }
}

Validator.isRequired = function(selector) {
    return {
        selector: selector,
        test: function (value) {
            return value.trim() ? undefined : 'Vui lòng nhập thông tin';
        }
    };
}

Validator.isFullname = function(selector, message){
    return {
        selector: selector,
        test: function (value) {

            // Chuyển các ký tự có dấu về k dấu
            function removeAscent (str) {
                if (str === null || str === undefined) return str;
                str = str.toLowerCase();
                str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
                str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
                str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
                str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
                str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
                str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
                str = str.replace(/đ/g, "d");
                return str;
              }
            
            var result = /^([a-zA-Z0-9 _-]+)$/;
            return result.test(removeAscent(value)) ? undefined :message || 'Vui lòng nhập thông tin của bạn';
        }
    };
}

Validator.isEmail = function(selector, message ) {
    return {
        selector: selector,
        test: function (value){
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message ||'Vui lòng nhập thông tin';
        }
    };
}

Validator.checkPassword = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            var decimal = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,32}$/;
            return decimal.test(value) ? undefined : message || 'Vui lòng nhập thông tin của bạn'
        }
    };
}

Validator.isConfirmed = function(selector, getConfirmValue, message){
    return {
        selector: selector,
        test: function(value){
            return value === getConfirmValue() ? undefined : message || 'Vui lòng nhập thông tin của bạn';
        }
    };
}