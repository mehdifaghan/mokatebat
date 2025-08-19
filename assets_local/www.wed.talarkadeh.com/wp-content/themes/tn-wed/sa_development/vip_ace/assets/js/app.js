class SendComment {
    constructor() {
        this.sendCommentBtn = document.querySelector('.send-comment__btn')
        this.username = document.querySelector('[name="username"]')
        this.mobile = document.querySelector('[name="mobile"]')
        this.message = document.querySelector('[name="message"]')
        this.sendCommentBtn.addEventListener('click', this.send.bind(this))

    }

    send(e) {
        e.preventDefault();
        this.sendCommentBtn.setAttribute('disabled', true)
        let willCome = document.querySelector('[name="will_come"]:checked');

        $.ajax({
            url: apiJs.url,
            data: {
                action: 'send_comment',
                _ajax_nonce: apiJs.nonce,
                slug: window.location.href,
                username: this.username.value,
                mobile: this.mobile.value,
                message: this.message.value,
                will_come: willCome ? willCome.value : null,
            },
            method: "POST",
            success: (res) => {
                Swal.fire({
                    icon: 'success',
                    title: ' ',
                    text: 'یادبود شما با موفقیت ثبت شد',
                    showConfirmButton: false,
                })

            },
            error: (err) => {
                console.log(err);
                this.sendCommentBtn.removeAttribute('disabled')
            },

        })
    }
}

new SendComment();



// (function () {
//     const windowHeight = window.innerHeight;
//     const navbar = document.querySelector('#qbootstrap-header');
//     window.addEventListener('scroll', () => {
//         let scrollTop = window.scrollY || document.documentElement.scrollTop;
//         if ((windowHeight - 50) <= scrollTop) {
//             navbar.style.marginTop = "-20px";
//             setTimeout(() => {
//                 navbar.classList.add('fix-navbar');
//             }, 10)
//         } 
//         if(scrollTop == 0) {
//             navbar.style = '';
//             navbar.classList.remove('fix-navbar');
//         }
//     })
// })();