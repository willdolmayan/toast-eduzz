var toast = {
    toastEl: document.createElement('div'),
    intervalFunc: function() {},
    closeToast: function() {
        clearInterval(this.intervalFunc);
        this.toastEl.classList.remove('active');
    },
    showToast: function(data, timeout) {
        var that = this;
        var elHtml = '<div class="toastIcon">\
              <svg xmlns="http://www.w3.org/2000/svg" version="1.1" id="Capa_1" x="0" y="0" width="512" height="512" viewBox="0 0 37.286 37.287" style="enable-background:new 0 0 37.286 37.287" xml:space="preserve">\
                <path d="M36.683 16.339l-7.567 7.377 1.786 10.417c.128.75-.182 1.509-.797 1.957-.348.253-.762.382-1.176.382-.318 0-.638-.076-.931-.23l-9.355-4.918-9.355 4.918c-.674.355-1.49.295-2.107-.15-.615-.448-.924-1.206-.795-1.957l1.787-10.417L.604 16.34c-.547-.531-.741-1.326-.508-2.05.236-.724.861-1.251 1.615-1.361l10.459-1.521 4.68-9.478c.335-.684 1.031-1.116 1.792-1.116.763 0 1.456.432 1.793 1.115l4.68 9.478 10.461 1.521c.752.109 1.379.637 1.611 1.361.238.724.039 1.519-.504 2.05z" fill="#FFF"/>\
              </svg>\
            </div> \
            <div class="toastContent"> \
              <p>' + data.text + '</p> \
            </div> \
            <a class="toastClose" onclick="window.toast.closeToast()"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"> \
                <path d="M44.8 9.4l-4.2-4.2L25 20.8 9.4 5.2 5.2 9.4 20.8 25 5.2 40.6l4.2 4.2L25 29.2l15.6 15.6 4.2-4.2L29.2 25"/> \
              </svg> \
            </a>';

        that.toastEl.innerHTML = elHtml;

        that.toastEl.classList.add('active');
        var timeoutFunc = setTimeout(function() {
            that.toastEl.classList.remove('active');
            clearTimeout(timeoutFunc);
        }, timeout);
    },
    init: function(productId) {
        var that = this;

        that.toastEl.className = "toastContainer";
        document.body.appendChild(this.toastEl);

        var request = new XMLHttpRequest();
        request.open('GET', 'https://api.eduzz.com/api/contents/notificationCheckoutInfo/' + productId + '.json', true);

        request.onload = function() {
            if (request.status < 200 || request.status > 400) {
                return;
            }
            var data = JSON.parse(request.responseText).data;

            data = that.spliceArray(data);
            console.log(data);

            if(!data || !data.length) {
                return;
            }

            window.toast = that;
            
            var count = 0;

            that.intervalFunc = setInterval(function() {
                if(count >= data.length && data.length) {
                    that.closeToast();
                    return;
                }
                that.showToast(data[count++], 4000);
            }, 5000);

        };

        request.send();
    },
    spliceArray: function (data) {
        console.log(data);
        return data.filter(function(value) {
            return value.status === true;
        }).filter(function(value) {
            return value.id !== 1 ?
            parseInt(value.total) >= parseInt(value.displayWhen) :
            parseInt(value.total) <= parseInt(value.displayWhen);
        });
    }
};

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = toast;
  }
  else {
    if (typeof define === 'function' && define.amd) {
      define([], function() {
        return toast;
      });
    }
    else {
      window.toast = toast;
    }
  }
