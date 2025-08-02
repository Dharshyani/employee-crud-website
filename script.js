// To Get Saved User Data from LocalStorage
let users = JSON.parse(localStorage.getItem("users") || "[]");
let editingIndex = null;

const form = document.getElementById("employeeForm");
const userTable = document.getElementById("userTable");
const userData = document.getElementById("userData");
const noUserMsg = document.getElementById("noUserMsg");
const profilePreview = document.getElementById("profilePreview");

// Image
     document.getElementById("uploadBtn").addEventListener("click", function () {
     document.getElementById("profileImage").click();
    });
    document.getElementById("profileImage").addEventListener("change", function (e) {
      const file = e.target.files[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => profilePreview.src = reader.result;
        reader.readAsDataURL(file);
      } else {
        document.getElementById("imgError").innerText = "Invalid image format.";
      }
    });

fetch("https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/refs/heads/master/json/countries%2Bstates%2Bcities.json")
  .then(res => {
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return res.json();
  })
  .then(data => {
    const countrySel = document.getElementById("country");
    const stateSel = document.getElementById("state");

    // Populate country dropdown
    data.forEach(country => {
      const opt = document.createElement("option");
      opt.value = country.name;
      opt.innerText = country.name;
      countrySel.appendChild(opt);
    });

    // Populate states based on selected country
    countrySel.addEventListener("change", () => {
      stateSel.innerHTML = "<option value=''>Select State *</option>";
      const selected = data.find(c => c.name === countrySel.value);
      if (selected && selected.states) {
        selected.states.forEach(state => {
          const opt = document.createElement("option");
          opt.value = state.name;
          opt.innerText = state.name;
          stateSel.appendChild(opt);
        });
      }
    });
  })
  .catch(error => {
    console.error("Failed to fetch country/state data:", error);
    alert("Error loading location data. Please try again later.");
  });

    document.getElementById("name").addEventListener("input", e => {
      e.target.value = e.target.value.slice(0, 4);
    });

    document.getElementById("phone").addEventListener("input", e => {
      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
    });

    document.getElementById("pincode").addEventListener("input", e => {
      let value = e.target.value.replace(/\D/g, '');
      if (!value.startsWith("6")) value = "6";
      e.target.value = value.slice(0, 6);
    });

    function renderTable() {
      userData.innerHTML = "";
      if (users.length === 0) {
        userTable.style.display = "none";
        noUserMsg.innerText = "No Users Found. Please Register a User..";
        noUserMsg.style.display = "block";
        return;
      }

      noUserMsg.style.display = "none";
      userTable.style.display = "table";

      users.forEach((user, i) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td><img src="${user.profile}" width="40" height="40" style="border-radius:50%"></td>
          <td>${user.name}</td>
          <td>${user.company}</td>
          <td>${user.designation}</td>
          <td>${user.phone}</td>
          <td>${user.email}</td>
          <td class="action-btns">
            <button class="edit-btn" onclick="editUser(${i})">Edit</button>
            <button class="delete-btn" onclick="deleteUser(${i})">Delete</button>
          </td>`;
        userData.appendChild(row);
      });
    }


form.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const company = document.getElementById("company").value;
      const designation = document.getElementById("designation").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const country = document.getElementById("country").value;
      const state = document.getElementById("state").value;
      const address = document.getElementById("address").value.trim();
      const email = document.getElementById("email").value.trim();
      const pincode = document.getElementById("pincode").value.trim();
      const profile = profilePreview.src;

      if (name.length < 2 || name.length > 4) return alert("Name must be 2 to 4 characters.");
      if (!company) return alert("Select a company.");
      if (!designation) return alert("Enter a designation.");
      if (!/^\d{10}$/.test(phone)) return alert("Phone must be exactly 10 digits.");
      if (!country) return alert("Select a country.");
      if (!state) return alert("Select a state.");
      if (!address) return alert("Enter address.");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return alert("Enter a valid email.");
      if (!/^6\d{5}$/.test(pincode)) return alert("Pincode must start with 6 and be 6 digits.");

      const user = { profile, name, company, designation, phone, country, state, address, email, pincode };

      if (editingIndex !== null) {
        users[editingIndex] = user;
        editingIndex = null;
      } else {
        users.push(user);
      }

      localStorage.setItem("users", JSON.stringify(users));  // Saves User Array to localstorage
      form.reset();
      profilePreview.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
      renderTable();
    });

    window.editUser = function (index) {
      const u = users[index];
      editingIndex = index;

      document.getElementById("name").value = u.name;
      document.getElementById("company").value = u.company;
      document.getElementById("designation").value = u.designation;
      document.getElementById("phone").value = u.phone;
      document.getElementById("country").value = u.country;
      document.getElementById("address").value = u.address;
      document.getElementById("email").value = u.email;
      document.getElementById("pincode").value = u.pincode;
      document.getElementById("state").innerHTML = `<option selected>${u.state}</option>`;
      profilePreview.src = u.profile;
    }

    window.deleteUser = function (index) {
      if (confirm("Are you sure?")) {
        users.splice(index, 1);
        localStorage.setItem("users", JSON.stringify(users));
        renderTable();
      }
    }
    renderTable();
    