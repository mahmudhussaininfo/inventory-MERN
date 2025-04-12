export const htmlContent = (name, email, password) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; background: #f4f4f4;">
        <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <div style="background: #4CAF50; color: white; padding: 20px; text-align: center;">
            <h1>Welcome to Inventory App</h1>
        </div>
        <div style="padding: 30px;">
            <p>Hello <strong>${name}</strong>,</p>
            <p>Welcome to <strong>Inventory App</strong>! Your account has been created successfully.</p>
            <p><strong>Here are your login credentials:</strong></p>
            <ul>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Password:</strong> ${password}</li>
            </ul>
            <p>Please keep this information secure.</p>
            <br/>
            <p>Regards,<br/>The Inventory App Team</p>
        </div>
        </div>
    </div>`;
};

export const htmlContentOtp = (name, email, otp) => {
  return `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: #f4f4f4;">
          <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <div style="background: #4CAF50; color: white; padding: 20px; text-align: center;">
              <h1>Otp Code for recover your Account</h1>
          </div>
          <div style="padding: 30px;">
              <p>Hello <strong>${name}</strong>,</p>
              <p>Welcome to <strong>Inventory App</strong>! Your opt code is here.</p>
              <p><strong>Here are your login credentials:</strong></p>
              <ul>
              <li><strong>Email:</strong> ${email}</li>
              <li><strong>Otp Code:</strong> ${otp}</li>
              </ul>
              <p>Please Save your Otp and next step for recover your Account.</p>
              <br/>
              <p>Regards,<br/>The Inventory App Team</p>
          </div>
          </div>
      </div>`;
};
