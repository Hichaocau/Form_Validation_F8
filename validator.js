
function Validator(options){

    function Validate(inputElement, rule){

        var errorElement = inputElement.parentElement.querySelector(options.errorSelector)

        // value: inputElement.value
        // test function: rule.test
        var errorMessage = rule.test(inputElement.value)

        if(errorMessage) {
            errorElement.innerHTML = errorMessage
            inputElement.parentElement.classList.add('invalid')
        }
        else{
            errorElement.innerHTML = ''
            inputElement.parentElement.classList.remove('invalid')
        }
    }

    // Lấy element của form cần validate
    var formElement = document.querySelector(options.form)
    
    if(formElement){
        options.rules.forEach(rule => {
            
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

// Validator.isConfirmed = function(){

// }
