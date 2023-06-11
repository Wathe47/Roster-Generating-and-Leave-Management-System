const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

module.exports = class Email {
  constructor(touser, url, datauser, leave) {
    this.to = touser.email;
    this.firstName = touser.name.split(" ")[0];
    this.url = url;
    this.from = `tgo <${process.env.EMAIL_FROM}>`;

    if (datauser && leave) {
      this.firstName = datauser.name.split(" ")[0];
      this.receiverName = touser.name.split(" ")[0];
      this.role = datauser.jobTitle;
      this.leaveDate = leave.date;
      this.leaveType = leave.type;
      this.toRole = touser.jobTitle;
      this.reason = leave.reason;
    }
  }

  newTransport() {
    if (process.env.NODE_ENV === "production") {
      //SEND EMAILS IN SENDINBLUE
      return nodemailer.createTransport({
        host: process.env.SENDINBLUE_HOST,
        port: process.env.SENDINBLUE_PORT,
        auth: {
          user: process.env.SENDINBLUE_EMAIL,
          pass: process.env.SENDINBLUE_PASSWORD,
        },
      });
    }
    //SEND EMAILS IN MAILTRAP
    return nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    //HTML TEMPLATE
    const html = fs.readFileSync(
      path.join(__dirname, `../views/email/${template}.html`),
      "utf-8"
    );

    //EMAIL OPTIONS
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html: html
        .replace("{%firstName%}", this.firstName)
        .replace("{%url%}", this.url),
    };
    //CREATE A TRANSPORT AND SEND EMAIL
    await this.newTransport().sendMail(mailOptions);
  }

  async sendLeave(template, subject) {
    //HTML TEMPLATE
    const html = fs.readFileSync(
      path.join(__dirname, `../views/email/${template}.html`),
      "utf-8"
    );

    //EMAIL OPTIONS
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html: html
        .replace("{%receiverName%}/g", this.firstName)
        .replace("{%role%}", this.role)
        .replace("{%leaveDate%}", this.leaveDate)
        .replace("{%leaveType%}", this.leaveType)
        .replace("{%firstName%}/g", this.receiverName),
    };

    //CREATE A TRANSPORT AND SEND EMAIL
    await this.newTransport().sendMail(mailOptions);
  }

  async sendLeaveApprovedOrRejected(template, subject) {
    const html = fs.readFileSync(
      path.join(__dirname, `../views/email/${template}.html`),
      "utf-8"
    );

    //EMAIL OPTIONS
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html: html
        .replace(/{%receiverName%}/g, this.firstName)
        .replace("{%role%}", this.toRole)
        .replace("{%leaveDate%}", this.leaveDate)
        .replace("{%leaveType%}", this.leaveType)
        .replace(/{%firstName%}/g, this.receiverName)
        .replace("{%jobTitle%}", this.role)
        .replace("{%reason%}", this.reason),
    };

    //CREATE A TRANSPORT AND SEND EMAIL
    await this.newTransport().sendMail(mailOptions);
  }

  async sendTesting() {
    await this.send("Testing", "Testing-Email");
  }

  async sendLeaveApproved() {
    await this.sendLeaveApprovedOrRejected("LeaveApproved", "Leave Approved");
  }

  async sendLeaveRejected() {
    await this.sendLeaveApprovedOrRejected("LeaveRejected", "Leave Rejected");
  }

  async sendNotifyLeave() {
    await this.sendLeave("NotifyLeave", "Leave Notification");
  }
};
