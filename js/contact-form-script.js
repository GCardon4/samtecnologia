/*==============================================================*/
// Contact Form JS — FormSubmit.co AJAX
/*==============================================================*/
(function ($) {
    "use strict";

    $("#contactForm").validator().on("submit", function (event) {
        if (event.isDefaultPrevented()) {
            formError();
            submitMSG(false, "Por favor completa todos los campos correctamente.");
        } else {
            event.preventDefault();
            submitForm();
        }
    });

    function submitForm() {
        var name    = $("#name").val();
        var email   = $("#email").val();
        var phone   = $("#phone_number").val();
        var subject = $("#msg_subject").val();
        var message = $("#message").val();

        var $btn = $("#contactForm button[type='submit']");
        $btn.text("Enviando...").prop("disabled", true);

        fetch("https://formsubmit.co/ajax/info@samtecnologia.com.co", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                "_subject": "Nuevo contacto desde SAM Servicios Integrales",
                "_template": "table",
                "_captcha": "false",
                "Nombre": name,
                "Correo": email,
                "Telefono": phone,
                "Asunto": subject,
                "Mensaje": message
            })
        })
        .then(function (response) { return response.json(); })
        .then(function (data) {
            $btn.text("Enviar").prop("disabled", false);

            if (data.success === "true" || data.success === true) {
                formSuccess();
            } else {
                formError();
                var serverMsg = (data.message || "").toLowerCase();
                var userMsg;

                if (serverMsg.indexOf("activation") !== -1 || serverMsg.indexOf("activate") !== -1) {
                    userMsg = "El formulario necesita activación. Por favor revisa el correo info@samtecnologia.com.co y haz clic en el enlace de activación de FormSubmit.";
                } else if (serverMsg.indexOf("verify") !== -1) {
                    userMsg = "Por favor verifica el correo info@samtecnologia.com.co para activar el envío de mensajes.";
                } else {
                    userMsg = "No se pudo enviar el mensaje. Por favor inténtalo de nuevo o contáctanos por WhatsApp.";
                }
                submitMSG(false, userMsg);
            }
        })
        .catch(function (err) {
            $btn.text("Enviar").prop("disabled", false);
            formError();
            submitMSG(false, "Error de conexión. Por favor inténtalo de nuevo o escríbenos al WhatsApp.");
        });
    }

    function formSuccess() {
        $("#contactForm")[0].reset();
        submitMSG(true, "¡Mensaje enviado! Nos contactaremos contigo muy pronto.");
    }

    function formError() {
        $("#contactForm")
            .removeClass()
            .addClass("shake animated")
            .one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function () {
                $(this).removeClass();
            });
    }

    function submitMSG(valid, msg) {
        var msgClasses = valid ? "h4 tada animated text-success" : "h4 text-danger";
        $("#msgSubmit").removeClass().addClass(msgClasses).text(msg);
    }

}(jQuery));
