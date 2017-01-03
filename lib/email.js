require('dotenv').config();

module.exports = {
    sendEmail: function (message, image){
      var helper = require('sendgrid').mail;
      var from_email = new helper.Email('test@example.com');
      var to_email = new helper.Email(process.env.EMAIL);
      var subject = 'Your Shopping List';
      var content = new helper.Content('text/html', message);
      var mail = new helper.Mail(from_email, subject, to_email, content);
      var sg = require('sendgrid')(process.env.SENDGRIDKEY2);
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
};
