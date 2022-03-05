
function Validator(options){

    var selectorRules = {};

    function Validate(inputElement, rule){

        var errorElement = inputElement.parentElement.querySelector(options.errorSelector)

        // value: inputElement.value
        // test function: rule.test
        var errorMessage;

        // Lấy ra các rules của selector
        var rules = selectorRules[rule.selector]
        
        // Lặp qua từng rule $ kiểm tra
        // Nếu có lỗi thì dừng việc kiểm tra
        for (var i = 0; i < rules.length; i++){
            errorMessage = rules[i](inputElement.value);
            if(errorMessage) break;
        }

        if(errorMessage) {
            errorElement.innerHTML = errorMessage
            inputElement.parentElement.classList.add('invalid')
        }
        else{
            errorElement.innerHTML = ''
            inputElement.parentElement.classList.remove('invalid')
        }

        return !errorMessage
    }

    // Lấy element của form cần validate
    var formElement = document.querySelector(options.form)
    
    if(formElement){
        formElement.addEventListener('submit', (e) => {
            // Khi submit form không load lại trang
            e.preventDefault();

            var isFormValid = true;

            options.rules.forEach(rule => {
                var inputElement = formElement.querySelector(rule.selector)      
                var isValid = Validate(inputElement, rule)
                if(!isValid){
                    isFormValid = false;
                }
            });

            if(isFormValid){
                // Trường hợp submit với javascript
                if (typeof options.onSubmit === 'function'){
                    var enableInputs = formElement.querySelectorAll('[name]')
                    var formValues = Array.from(enableInputs).reduce(function(values, input){
                        return (values[input.name] = input.value) && values;
                    }, {})       
                    options.onSubmit(formValues)
                }
                // Trường hợp submit với hành vi mặc định
                else{
                    formElement.submit()
                }

            }
        })

        // Lặp qua mỗi rule và xử lý (lắng nghe sự kiện blur, input,...)
        options.rules.forEach(rule => {
            
            // Lưu lại các rules cho mỗi input
            if (Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test)
            }
            else
            {
                selectorRules[rule.selector] = [rule.test]
            }

            var inputElement = formElement.querySelector(rule.selector)      

            if (inputElement){
                // Xử lý trường hợp blur khỏi input
                inputElement.addEventListener('blur', () =>{
                    Validate(inputElement, rule)
                })

                // Xử lý mỗi khi người dùng nhập vào input
                inputElement.addEventListener('input', () =>{
                    var errorElement = inputElement.parentElement.querySelector(options.errorSelector)
                    errorElement.innerHTML = ''
                    inputElement.parentElement.classList.remove('invalid')
                })

            }
        })
    }
}


// Định nghĩa rules
// Nguyên tắc của các rules
// 1. Khi có lỗi => Trả ra message lỗi
// 2. Khi hợp lệ => Không trả ra gì cả (undefined)
Validator.isRequired = function(selector) {
    return {
        selector: selector,
        test(value){
            return value.trim() ? undefined : 'Vui lòng nhập trường này'
        }
    }
}

Validator.isEmail = function(selector) {
    return {
        selector: selector,
        test(value) {
            var regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            return regex.test(value) ? undefined : 'Trường này phải là email'
        }
    }
}

Validator.minLength = function(selector, min) {
    return {
        selector: selector,
        test(value) {
            return value.length >= min? undefined : `Vui lòng nhập tối thiểu ${min} ký tự`
        }
    }
}

Validator.isConfirmed = function(selector , getCofirmValue, message) {
    return {
        selector: selector,
        test(value){
            return value === getCofirmValue() ? undefined : message || 'Giá trị nhập vào không chính xác'
        }
    }
}
