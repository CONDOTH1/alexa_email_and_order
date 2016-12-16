module.exports = {
    sendEmail: function (message){
      var helper = require('sendgrid').mail;
      var from_email = new helper.Email('test@example.com');
      var to_email = new helper.Email('thady@jigsaw.xyz');
      var subject = 'Your Shopping List';
      var content = new helper.Content('text/plain', message);
      var mail = new helper.Mail(from_email, subject, to_email, content);

      var sg = require('sendgrid')('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');
      var request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON(),
      });

      sg.API(request, function(error, response) {
        console.log(response.statusCode);
        console.log(response.body);
        console.log(response.headers);
      });
  }
}
