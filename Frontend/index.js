document.addEventListener("DOMContentLoaded", () => {
  const verifyBtn = document.getElementById("verifyBtn");
  const submitBtn = document.getElementById("submitBtn");
  const otpInput = document.getElementById("otpInput");
  const message = document.getElementById("message");
  const form = document.getElementById("attendanceForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(form);

    fetch(
      "https://script.google.com/macros/s/AKfycbzI6C9N7arsBt9pQORIjdlWt_-to6-_70ZmGSUJLAuBhbRvyyWhoQ__ld68StFGD9J_/exec",
      {
        method: "POST",
        body: formData,
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          message.innerText = "Attendance submitted successfully!";
          form.reset();
          submitBtn.disabled = true;
        } else {
          message.innerText = "Error submitting form";
        }
      })
      .catch((err) => {
        message.innerText = "Network error";
        console.error(err);
      });
  });

  verifyBtn.addEventListener("click", async () => {
    const userOtp = document.getElementById("otpInput").value;
    const name = document.getElementById("name").value;
    const regNo = document.getElementById("regNo").value;

    try {
      const response = await fetch(
        "https://otp-based-attendance.onrender.com/verify-otp" ||
          "http://localhost:3000/verify-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentOtp: userOtp,
            name: name,
            regNo: regNo,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        message.textContent = "✓ " + result.message;
        message.className = "success";
        verifyBtn.disabled = true;
        otpInput.disabled = true;
        submitBtn.disabled = false;
      } else {
        message.textContent = "X " + result.message;
        message.className = "error";
      }
    } catch (error) {
      message.textContent = "Server Error. Please try again later.";
    }
  });

  document.getElementById("attendanceForm").addEventListener("submit", (e) => {
    e.preventDefault();

    // Collect Data
    const formData = {
      name: document.getElementById("name").value,
      regNo: document.getElementById("regNo").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
    };

    console.log("Saving to Database:", formData);
    //alert("Attendance Marked Successfully!");
  });
});
