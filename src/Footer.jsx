import "./index.css";

function Footer() {
  return (
    <footer className="footer pt-5 pb-3">
      <div className="container">
        <div className="row">

          <div className="col-md-4 mb-4">
            <h4 className="fw-bold">Sharify</h4>
            <p>
              A smarter way to share tools, vehicles, and essentials—only when you need them.
            </p>
          </div>

          <div className="col-md-4 mb-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-decoration-none text-white">Home</a></li>
              <li><a href="#" className="text-decoration-none text-white">About</a></li>
              <li><a href="#" className="text-decoration-none text-white">Services</a></li>
              <li><a href="#" className="text-decoration-none text-white">Contact</a></li>
            </ul>
          </div>

          <div className="col-md-4 mb-4">
            <h5>Follow Us</h5>
            <div className="social-icons d-flex gap-4 mt-3">
              <a href="#" className="text-white"><i className="bi bi-facebook"></i></a>
              <a href="#" className="text-white"><i className="bi bi-instagram"></i></a>
              <a href="#" className="text-white"><i className="bi bi-linkedin"></i></a>
              <a href="#" className="text-white"><i className="bi bi-github"></i></a>
            </div>
          </div>

        </div>

        <hr />

        <div className="text-center small">
          © 2026 Sharify. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
