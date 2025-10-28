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
            margin-left: 50px;
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

        </style>
        <header>
          <nav>
            <img src="images/uiralogo.PNG" class="headerlogo">
            <h3>UIRA @ UCLA</h3>
            <ul>
              <li><a href="index.html">Home</a></li>
              <li><a href="about.html">About</a></li>
              <li><a href="contact.html">Contact</a></li>
              <li class="dropdown">
                <a>Poster Day Archive</a>
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

      

    }
  }
  
  customElements.define('header-component', Header);

                // <li><a href="https://docs.google.com/forms/d/e/1FAIpQLSeBjPGxwt7D1XYR6ewPVUk0R59oDKLASUUjJCu4ki1wRcWT6Q/viewform?usp=sf_link" class="button">Apply for Poster Day!</a></li>
                //              <li><a href="boardapp.html">Join Our Board!</a></li>
