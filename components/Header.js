class Header extends HTMLElement {
    constructor() {
      super();
    }
  
    connectedCallback() {
      this.innerHTML = `
          <style>  
            nav {
              height: 10vh;
              display: flex;
              align-items: center;
              justify-content: space-between;
              background-color: #F5F2EE;
            }


          h3 {
            margin-left: 20px;
            font-size: 25px;
          }

          ul {
            margin-right: 50px;
            padding: 0;
          }
          li {
            position: relative;
          }
          a {
            font-weight: lighter;
            font-size: 15px;
            margin: 0 25px;
            color: #fff;
            // text-decoration: none;
          }
          
          a:hover {
            padding-bottom: 5px;
            box-shadow:  12px 12px 2px 1px rgba(0, 0, 255, .2);
          }

          .dropdown-content {
            display: none;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            background-color: #F5F2EE;
            min-width: 160px;
            box-shadow: 0px 8px 16px rgba(0,0,0,0.2);
            z-index: 1;
            border-radius: 8px;
          }

          .dropdown-content a {
            display: block;
            padding: 10px 15px;
            margin: 0;
            color: #000;
          }

          .dropdown-content a:hover {
            background-color: rgba(0, 0, 255, 0.1);
          }

          .dropdown:hover .dropdown-content {
            display: flex;
          }

          .dropdown > a {
            cursor: default;
          }
            
          .headerlogo {
            max-height: 60px;
            margin-left: 30px;
          }

          .logo-link {
            display: inline-flex;
            align-items: center;
            cursor: pointer;
            text-decoration: none;
            position: relative;
            z-index: 10;
          }
          .logo-link:hover {
            padding-bottom: 0;
            box-shadow: none;
          }

          .hamburger {
            display: none;
            flex-direction: column;
            justify-content: center;
            gap: 5px;
            padding: 8px;
            background: transparent;
            border: none;
            cursor: pointer;
            z-index: 10;
          }
          .hamburger span {
            display: block;
            width: 24px;
            height: 2px;
            background: #333;
          }
          @media (max-width: 768px) {
            .hamburger {
              display: flex;
              margin-right: 20px;
            }
            .nav-links {
              display: none;
              position: absolute;
              top: 10vh;
              left: 0;
              right: 0;
              flex-direction: column;
              background: #F5F2EE;
              padding: 20px;
              margin: 0;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            nav.nav-open .nav-links {
              display: flex;
            }
            .nav-links li {
              margin: 10px 0;
            }
            .nav-links a {
              margin: 0;
            }
            .nav-open .dropdown .dropdown-content {
              position: static;
              display: none;
              box-shadow: none;
              padding-left: 15px;
            }
            .nav-open .dropdown.open .dropdown-content {
              display: flex;
            }
          }

        </style>
        <header>
          <nav>
            <a class="logo-link" href="index.html"><img src="images/uiralogo.PNG" class="headerlogo" alt="UIRA logo"></a>
            <h3>UIRA @ UCLA</h3>
            <button class="hamburger" type="button" aria-label="Toggle menu">
              <span></span>
              <span></span>
              <span></span>
            </button>
            <ul class="nav-links">
              <li><a href="index.html">Home</a></li>
              <li><a href="about.html">About</a></li>
              <li class="dropdown">
                <a class="dropdown-toggle">Poster Day Archive</a>
                <div class="dropdown-content">
                  <a href="posterday2024.html">2024</a>
                  <!--  <a href="posterday2025.html">2025</a>  -->
                </div>
              </li>
              <li><a href="recent.html">Recent Events</a></li>
              <!-- <li><a href="future_events.html">Future Events</a></li> -->
              <li><a href="https://forms.gle/3kmusUSjUaAQ7LQo6" target="_blank">Stay Updated!</a></li>
              </ul>
          </nav>
        </header>
      `;

      const nav = this.querySelector('nav');
      const hamburger = this.querySelector('.hamburger');
      const navLinks = this.querySelector('.nav-links');
      const dropdownToggle = this.querySelector('.dropdown-toggle');

      hamburger.addEventListener('click', () => {
        nav.classList.toggle('nav-open');
      });

      dropdownToggle.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          this.querySelector('.dropdown').classList.toggle('open');
        }
      });

      navLinks.querySelectorAll('a:not(.dropdown-toggle)').forEach(link => {
        link.addEventListener('click', () => {
          if (window.innerWidth <= 768) nav.classList.remove('nav-open');
        });
      });
    }
  }
  
  customElements.define('header-component', Header);

                // <li><a href="https://docs.google.com/forms/d/e/1FAIpQLSeBjPGxwt7D1XYR6ewPVUk0R59oDKLASUUjJCu4ki1wRcWT6Q/viewform?usp=sf_link" class="button">Apply for Poster Day!</a></li>
                //              <li><a href="boardapp.html">Join Our Board!</a></li>
