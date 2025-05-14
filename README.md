# ⚽ HTMLFC Fullstack

A complete frontend setup for the HTML Football Club system, featuring:

* 💠 `htmlfc-admin`: React + Ant Design admin dashboard
* 🌐 `doi-bong-main`: Static HTML/CSS/JS website for the public
* 🛣️ Dockerized & ready for CI/CD
* 🚀 Deployable to Google Cloud with GitHub Actions

---

## 📁 Project Structure

```bash
htmlfc-fullstack/
├── htmlfc-admin/          # Admin interface (React)
│   └── Dockerfile
├── doi-bong-main/         # Public-facing site (HTML/CSS/JS)
│   └── Dockerfile
├── docker-compose.yml     # Compose config for both FE services
└── .github/
    └── workflows/
        └── deploy-fe.yml  # CI/CD deploy to GCP VM
```

---

## 🥪 Live Demo

| Service     | URL (example)         |
| ----------- | --------------------- |
| Admin Panel | `http://35.247.156.29:3000/` |
| Public Site | `http://35.247.156.29:3001` |

---

## 🚀 Deployment

CI/CD is set up via GitHub Actions:

* On each push to `main`, the workflow:

  * SSHs into a GCP VM
  * Pulls the latest code
  * Builds and redeploys containers via Docker Compose

> **Secrets used in GitHub:**
>
> * `SSH_PRIVATE_KEY`
> * `VM_HOST`
> * `VM_USER`

---

## 🛣️ Run Locally with Docker

```bash
# Build & run both FE containers
docker compose up --build
```

* Visit `http://localhost:3000` for admin
* Visit `http://localhost:3001` for public site

---

## 💡 Tech Stack

* **React + Ant Design** (admin)
* **HTML/CSS/JS** (public)
* **Nginx** for static serving
* **Docker Compose**
* **GitHub Actions** for CI/CD
* **GCP Compute Engine (VM)** for hosting

---

## 👤 Author

* 👨‍💻 Built by [@minhquy1805](https://github.com/minhquy1805)
* 💬 Feedback & contributions are welcome!
