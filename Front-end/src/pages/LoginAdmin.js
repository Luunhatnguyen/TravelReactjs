
import React, { useState } from 'react';
import { Row} from "react-bootstrap" 
import { Col, Form } from 'react-bootstrap';
import Apis, { endpoints } from '../configs/Apis';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../ActionCreators/UserCreators';
import cookies from 'react-cookies';
import Header from '../components/Header';
import { Link} from 'react-router-dom'; 
import pageTitle5 from "../static/image/background/page-title-5.jpg";
import shape16 from "../static/image/shape/shape-16.png";
import shape17 from "../static/image/shape/shape-17.png";

function LoginAdmin() {

  const [username, setUsername] = useState()
  const [password, setPassword] = useState()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const login = async (event) => {
      event.preventDefault()

      try {
          let info = await Apis.get(endpoints['oauth2-info'])
          let res = await Apis.post(endpoints['login'], {
            'client_id': info.data.client_id,
            'client_secret': info.data.client_secret,
            'username': username,
            'password': password,
            'grant_type': 'password'
        })

       
        cookies.save('access_token', res.data.access_token)

        let user = await Apis.get(endpoints['current-user'], {
          headers: {
            'Authorization': `Bearer ${cookies.load('access_token')}`,
          }
        })

        console.info(user)

        cookies.save('user', user.data)
        
        dispatch(loginUser(user.data))
        navigate('/admin');
      } catch(err) {
        console.error(err)
      }
  }

  return (
    <>
      <Header/>
      
      <section className="page-title centred"style={{ backgroundImage: `url(${pageTitle5})` }}>
                <div className="auto-container">
                    <div className="content-box wow fadeInDown animated animated"
                        data-wow-delay="00ms"
                        data-wow-duration="1500ms">
                        <h1>????ng Nh???p</h1>
                        <p>Kh??m ph?? cu???c phi??u l??u tuy???t v???i ti???p theo c???a b???n</p>
                    </div>
                </div>
      </section>
      <section className="register-section sec-pad">
                <div className="anim-icon">
                    <div
                        className="icon anim-icon-1"
                        style={{
                            backgroundImage: `url(${shape16})`
                        }}
                    />
                    <div
                        className="icon anim-icon-2"
                        style={{
                            backgroundImage: `url(${shape17})`
                        }}
                    />
                </div>
                <div className="auto-container">
                    <div className="inner-box">
                        <div className="sec-title centred">
                            <p>????ng Nh???p</p>
                            <h2>K???t n???i v???i ch??ng t??i ????? c?? chuy???n tham quan t???t h??n</h2>
                        </div>
                        <div className="form-inner">
                            <h3>????ng Nh???p v???i</h3>
                            <ul className="social-links clearfix">
                                <li>
                                    <Link to="/">
                                        <span>????ng Nh???p v???i Facebook _</span>
                                        <i className="fab fa-facebook-f" />
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/">
                                        <span>????ng Nh???p v???i Google _</span>
                                        <i className="fab fa-google-plus-g" />
                                    </Link>
                                </li>
                            </ul>
                            <div className="text">
                                <span>ho???c</span>
                            </div>
                <Form onSubmit={login}  >
                    <div className="row clearfix">
                    <h1 className="text-center text-success">????NG NH???P ADMIN</h1>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label>T??n ????ng nh???p</Form.Label>
                      <Form.Control type="text" 
                                    placeholder="Username"
                                    value={username}
                                    onChange={(event) => setUsername(event.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                      <Form.Label>M???t kh???u</Form.Label>
                      <Form.Control type="password" 
                                    placeholder="Password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)} />
                    </Form.Group>
                    <div className="col-lg-12 col-md-12 col-sm-12 column">
                        <div className="form-group">
                             <div className="forgor-password text-right">
                                <Link to="/forgot-password">Qu??n m???t kh???u?</Link>
                            </div>
                         </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12 column">
                        <div className="form-group message-btn">
                            <Button  type="submit" className="theme-btn">
                            ????ng nh???p
                            </Button>
                        </div>
                    </div>
                    </div>
                  </Form>
                  <div className="other-text">
                                Ch??a c?? t??i kho???n? <Link to="/register">????ng K?? Ngay</Link>
                 </div>        
                        </div>
                    </div>
                </div>
            </section>
    
    </>
  )
}
export default LoginAdmin;

function LoginForm(props){
  return (
      <>
          <div className="col-lg-12 col-md-12 col-sm-12 column">
              <div className="form-group">
                  <label>{props.label}</label>
                  <input
                      value={props.field}
                      type={props.type}
                      id={props.id}
                      onChange={props.change}
                      required />
              </div>
          </div>
      </>
  )
}

