let pubkey = "WUNjVUpVMHNsX01tRUVTZVM=";
let serviceId = "c2VydmljZV80bm8xajF3";
let templateId = "dGVtcGxhdGVfdjd3ajN0dw==";

emailjs.init(atob(pubkey));

function sendEmail(templateParams) {
    emailjs.send(atob(serviceId), atob(templateId), templateParams)
        .then(function(response) {
            $(".status-spinner").addClass("d-none");
            $(".status-success").removeClass("d-none");
            $("#order-button").addClass("d-none");
            $("#order-close").removeClass("d-none");
        }, function(error) {
            console.log(error);
            $(".status-spinner").addClass("d-none");
            $(".status-fail").removeClass("d-none");
            $("#order-button").prop("disabled", false);
        });
}