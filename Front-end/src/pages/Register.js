import React, { useEffect, useRef, useState } from 'react';
import API, { endpoints } from '../configs/Apis';
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import WOW from 'wowjs';

import Header from '../components/Header';
import pageTitle9 from "../static/image/background/page-title-9.jpg"
import shape16 from "../static/image/shape/shape-16.png"
import shape17 from "../static/image/shape/shape-17.png"
import MessageSnackbar from '../components/MessageSnackbar';

export default function Register(props) {
    const navigate = useNavigate()
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const avatar = useRef();

    // State of message
    const [open, setOpen] = React.useState(false);
    const [msg, setMsg] = useState('')
    const [typeMsg, setTypeMsg] = useState('')
    const [titleMsg, setTitleMsg] = useState('')

    const handleMessageClose = () => {
        setOpen(false);
    };

    const createMessage = (title, msg, type) => {
        setMsg(msg)
        setTitleMsg(title)
        setTypeMsg(type)
    }
    // End message

    useEffect(() => {
        new WOW.WOW({live: false}).init();
    }, [])

    const register = (event) => {
        event.preventDefault()

        let registerUser = async () => {
            const formData = new FormData()
            formData.append("first_name", firstName);
            formData.append("last_name", lastName);
            formData.append("email", email);
            formData.append("username", username);
            formData.append("password", password);
            formData.append("avatar", avatar.current.files[0]);

            try {
                await API.post(endpoints['users'], formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                setOpen(true)
                createMessage('Th??nh c??ng', '????ng k?? th??nh c??ng. H??y ????ng nh???p ????? s??? d???ng t??i kho???n', 'success')
                navigate("/login")
            } catch (error) {
                console.error(error)
                setOpen(true)
                createMessage('L???i', '????ng k?? th???t b???i.', 'error')
            }
        }

        let alphabet_count = 0;
        let number_count = 0;
        for (let i = 0; i < password.length; i++) {
            let c = password.charAt(i);

            if ('A' <= c && c <= 'Z') {
                alphabet_count += 1;
            } else if ('a' <= c && c <= 'z') {
                alphabet_count += 1;
            } else if ('0' <= c && c <= '9') {
                number_count += 1;
            }
        }

        if (password.length > 7) {
            if (alphabet_count === 0 || number_count === 0) {
                setOpen(true)
                createMessage('Invalid Password', 'H??y ?????t m???t kh???u c?? c??? k?? t??? ch??? v?? s??? !', 'warning')
            } else {
                if (password === confirmPassword) {
                    registerUser()
                } else {
                    setOpen(true)
                    createMessage('C???nh b??o', 'M???t kh???u x??c nh???n kh??ng ch??nh x??c', 'warning')
                }
            }
        } else {
            setOpen(true)
            createMessage('Invalid Password', 'H??y ?????t m???t kh???u t???i thi???u 8 k?? t??? !', 'warning')
        }
    }

    
    return (
        <>
            <Header/>
            <section className="page-title centred" style={{ backgroundImage: `url(${pageTitle9})` }}>
                <div className="auto-container">
                <div className="content-box wow fadeInDown animated animated" data-wow-delay="00ms" data-wow-duration="1500ms">
                    <h1>????ng K??</h1>
                    <p>Kh??m ph?? cu???c phi??u l??u tuy???t v???i ti???p theo c???a b???n</p>
                </div>
                </div>
            </section>
            <section className="register-section sec-pad">
                <div className="anim-icon">
                    <div className="icon anim-icon-1" style={{ backgroundImage: `url(${shape16})` }}/>
                    <div className="icon anim-icon-2" style={{ backgroundImage: `url(${shape17})` }}/>
                </div>
                <div className="auto-container">
                    <div className="inner-box">
                        <div className="sec-title centred wow fadeInUp animated animated" data-wow-delay="00ms" data-wow-duration="1500ms">
                            <p>????ng K??</p>
                            <h2>K???t n???i v???i ch??ng t??i ????? c?? chuy???n tham quan t???t h??n</h2>
                        </div>
                        <div className="form-inner">
                            <h3>????ng k?? v???i</h3>
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
                            <form onSubmit={register} className="register-form">
                                <div className="row clearfix">
                                    <RegisterForm class="col-lg-6 col-md-6 col-sm-12 column"
                                    id="firstname" label="H??? v?? t??n ?????m" type="text"
                                     value={firstName} change={(event) => setFirstName(event.target.value)}/>
                                    <RegisterForm class="col-lg-6 col-md-6 col-sm-12 column"
                                        id="lastname" label="T??n" type="text" 
                                        value={lastName} change={(event) => setLastName(event.target.value)}/>
                                    <RegisterForm class="col-lg-12 col-md-12 col-sm-12 column"
                                        id="email" label="Email" type="email"
                                         value={email} change={(event) => setEmail(event.target.value)}/>
                                    <RegisterForm class="col-lg-12 col-md-12 col-sm-12 column"
                                        id="username" label="T??n ????ng nh???p" type="text" 
                                        value={username} change={(event) => setUsername(event.target.value)}/>
                                    <RegisterForm class="col-lg-12 col-md-12 col-sm-12 column"
                                        id="password" label="M???t kh???u" type="password" 
                                        value={password} change={(event) => setPassword(event.target.value)}/>
                                    <RegisterForm class="col-lg-12 col-md-12 col-sm-12 column"
                                        id="confirmPass" label="X??c nh???n m???t kh???u" type="password" 
                                        value={confirmPassword} change={(event) => setConfirmPassword(event.target.value)}/>                                    
                                    <div className="col-lg-12 col-md-12 col-sm-12 column">
                                        <div className="form-group">
                                            <label>Avatar</label>
                                            <input type="file" id="avatar" ref={avatar} />
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-sm-12 column">
                                        <div className="form-group message-btn">
                                            <button type="submit" className="theme-btn">
                                                ????ng k??
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                            <div className="other-text">
                                ???? c?? t??i kho???n? <Link to="/login">????ng nh???p</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <MessageSnackbar
                handleClose={handleMessageClose}
                isOpen={open}
                msg={msg}
                type={typeMsg}
                title={titleMsg}
            />
        </>
    )
}

function RegisterForm(props) { {
        return (
            <>
                <div className={props.class}>
                    <div className="form-group">
                        <label>{props.label}</label>
                        <input
                            value={props.value}
                            type={props.type}
                            id={props.id}
                            onChange={props.change}
                            required />
                    </div>
                </div>
            </>
        )
    }
}