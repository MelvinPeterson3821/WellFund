  // Function to handle authentication check on page load
  window.onload = function () {
    if (localStorage.authToken == null) {
      NoUserAuth();
    } else {
      BasicAuth();
    }
  };

  /**
   * NoUserAuth() - Displays an alert prompting the user to log in
   */
  function NoUserAuth() {
    const account_alert_popup = document.getElementById("account_alert_popup");
    const account_alert_header_text = document.getElementById("account_alert_header_text");
    const account_alert_details_text = document.getElementById("account_alert_details_text");
    const account_alert_btn = document.getElementById("account_alert_btn");

    account_alert_popup.style.display = "block";
    account_alert_header_text.textContent = "You Are Not Logged In";
    account_alert_details_text.textContent =
      "There is no log in detected. Please log into your user account to continue.";
    account_alert_btn.textContent = "Log In";
    account_alert_btn.onclick = function () {
      window.location.href = "https://www.mywellfund.com/user/log-in";
    };

    setTimeout(() => {
      if (window.location.href.indexOf("mywellfund") === -1) {
        window.location.href = "https://www.mywellfund.com/user/log-in";
      }
    }, 15000);
  }

  /**
   * BasicAuth() - Fetches and populates user details in the navbar
   */
  function BasicAuth() {
    const nav_top_container = document.getElementById('nav_top_container');
    const nav_welcome_text = document.getElementById('nav_welcome_text');
    const nav_username = document.getElementById('nav_username');
    const nav_account_block = document.getElementById('nav_account_block');
    const nav_user_email = document.getElementById('nav_user_email');
    const nav_account_image = document.getElementById('nav_account_image');
    const nav_login_block = document.getElementById('nav_login_block');
    const nav_btn = document.getElementById('nav_btn');
    const nav_btn_txt = document.getElementById('nav_btn_txt');

    fetch("https://xk4s-ul6w-ry2f.n7d.xano.io/api:5CkqI7ox/auth/me_basic", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.authToken
        }
      })
      .then(res => {
        if (!res.ok) {
          console.warn("API response not OK. Status:", res.status, res.statusText);
          localStorage.removeItem('authToken');
          NoUserAuth();
          throw new Error(`Request failed with status ${res.status}`);
        }
        return res.json();
      })
      .then(json => {
        const xanoResponse = json;
        console.log("Xano response:", xanoResponse);

        nav_top_container.style.display = 'block';
        nav_welcome_text.style.display = 'block';
        nav_username.style.display = 'block';
        nav_username.textContent = xanoResponse.first_name || '';
        nav_account_block.style.display = 'block';
        nav_user_email.textContent = xanoResponse.email || '';

        if (xanoResponse.profile_image && xanoResponse.profile_image.url) {
          nav_account_image.src = xanoResponse.profile_image.url;
        }

        nav_btn_txt.textContent = "Start a Fundraiser";
        nav_btn.onclick = function () {
          window.location.href = "/user/account/create-fundraiser";
        };
      })
      .catch(error => {
        console.error("Error fetching user data:", error);
      });
  }
