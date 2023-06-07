// export const resetTemplate = (link: string, code: string, name?: string) => {
//   return `<!doctype html>
//     <html ⚡4email>
//       <head>
//         <meta charset="utf-8">
//       </head>
//       <body>
//         <p>Hi ${name},</p>
//         <p>You requested to reset your password.</p>
//         <h2>Reset Code: ${code}</h2>
//         <p> Please, click the link below to reset your password</p>
//           <a href="${link}">Reset Password</a>
//       </body>
//     </html>`;
// };

export const confirmTemplate = (sender: string, name: string, msg: string) => {
  return `<!doctype html>
    <html ⚡4email>
      <head>
        <meta charset="utf-8">
      </head>
      <body>
        <p>You have a message from ${name}, email: ${sender}</p>
        <h2>This is what ${name} left for you.</h2>
        <p>${msg}</p>
        <p>Note: if you got this by mistake, please ignore it</p>
      </body>
    </html>`;
};
