class Footer extends HTMLElement {
    constructor() {
      super();
    }
  
    connectedCallback() {
      this.innerHTML = `
        <style>
          footer {
            width: 100%;
            height: 60px;
            padding: 0 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: #F5F2EE;
            box-sizing: border-box;
          }
          
          ul li {
            list-style: none;
            display: inline;
          }
          
          a {
            margin: 0 15px;
            color: inherit;
            text-decoration: none;
          }
          
          a:hover {
            padding-bottom: 5px;
            box-shadow: inset 0 -2px 0 0 #333;
          }
          
          .social-row {
            font-size: 20px;
          }
          
          .social-row li a {
            margin: 0 15px;
          }

          .icon {
            font-size: 48px
          }

        </style>
        <footer>
          <h3>Undergraduate Interdisciplinary Research Association at UCLA</h3>
          <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="about.html">About</a></li>
            <li><a href="contact.html">Contact</a></li>
          </ul>
          <ul class="social-row">
            <li><a href="https://www.instagram.com/uirabruins/"><i class="fa-brands fa-instagram"></i></a></li>
          </ul>
        </footer>
      `;
    }
  }
  
  customElements.define('footer-component', Footer);