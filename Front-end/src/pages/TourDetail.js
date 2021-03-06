import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom'
import API, { endpoints } from '../configs/Apis';
import cookies from 'react-cookies'
import WOW from 'wowjs';
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, Rating } from "@mui/material";
import NumberFormat from 'react-number-format';
import advice1 from "../static/image/advice/advice-1.jpg"
import PreLoader from "../components/PreLoader"
import MessageSnackbar from "../components/MessageSnackbar";
import Header from '../components/Header';

export default function TourDetail() {
    const [tour, setTour] = useState([])
    const [services, setServices] = useState([])

    const [rating, setRating] = useState(0)

    const [comment, setComment] = useState("")
    const [listComment, setListComment] = useState([])
    const [commentChange, setCommentChange] = useState(0)

    const { tourId } = useParams()

    let user = useSelector(state => state.user.user)

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

    useEffect(() => {
        let getTour = async() => {
            try {
                let res = await API.get(endpoints['tour-details'](tourId), {
                    headers: {
                        'Authorization': `Bearer ${cookies.load('access_token')}`
                    }
                })
                setServices(res.data.service)
                setTour(res.data)
                setRating(res.data.rate)
            } catch (error) {
                console.error(error)
            }
        }

        let getComments = async() => {
            try {
                let res = await API.get(endpoints['tour-comments'](tourId))
                setListComment(res.data)
            } catch (error) {
                console.error(error)
            }
        }
        getComments()
        getTour()
    }, [tourId, commentChange])

    /* Handle Comment Function */
    const handleChange = (event) => {
        setComment(event.target.value)
    }

    const addRating = async (event, newValue) => {
        if (user != null) {
            if (window.confirm("B???n x??c nh???n ????nh gi?? tour n??y ?") === true) {
                try {
                    let res = await API.post(endpoints['rating'](tourId), {
                        "rating": newValue
                    }, {
                        headers: {
                            'Authorization': `Bearer ${cookies.load('access_token')}`
                        }
                    })
                    if (res.status === 200 || res.status === 201) {
                        setOpen(true)
                        createMessage('Th??nh c??ng', '????nh gi?? tour th??nh c??ng !', 'success')
                        setRating(newValue);
                    }
                } catch (error) {
                    setOpen(true)
                    createMessage('L???i', '????nh gi?? tour th???t b???i !', 'error')
                    console.error(error)
                }
            }
        } else {
            setOpen(true)
            createMessage('C???nh b??o', 'H??y ????ng nh???p ????? c?? th??? ????nh gi?? !', 'warning')
        }
    }
    

    const addComment = async (event) => {
        event.preventDefault()
        if (user != null) {
            try {
                let res = await API.post(endpoints['add-comment-tour'](tourId), {
                    "content": comment
                }, {
                    headers: {
                        'Authorization': `Bearer ${cookies.load('access_token')}`
                    }
                })
                
                if (res.status === 201) {
                    listComment.push(res.data)
                    setListComment(listComment)
                    setCommentChange(listComment.length)
                    setComment('')

                    setOpen(true)
                    createMessage('Th??nh c??ng', '????ng b??nh lu???n tour th??nh c??ng !', 'success')
                }
            } catch (error) {
                console.error(error)
                setOpen(true)
                createMessage('L???i', '????ng b??nh lu???n tour th???t b???i !', 'error')
            }
        }
        else {
            setOpen(true)
            createMessage('C???nh b??o', 'H??y ????ng nh???p ????? c?? th??? b??nh lu???n !', 'warning')
        }
    }
    /* End Comment Function */
    if (tour.length === 0) {
        return <PreLoader />
    }

    return (
        <>
        <Header/>
            <section className="page-title style-three" style={{ backgroundImage: `url(${tour.imageTour})` }}>
                <div className="auto-container">
                    <div className="inner-box wow fadeInDown animated animated" data-wow-delay="00ms" data-wow-duration="1500ms">
                        <div className="rating"><span><i className="fas fa-star"></i>{tour.rating}</span></div>
                        <h2 style={{ width: "750px" }}>{tour.tour_name}</h2>
                        <h3 >
                        <NumberFormat
                            value={tour.price_of_tour}
                            displayType={'text'}
                            thousandSeparator={true}
                            // prefix={'$'}
                            style={{color:'orange',fontSize:'50px'}}
                            />?? / 1 ng?????i
                        </h3>    
                    </div>
                </div>
            </section>

            <section className="tour-details">
                <div className="auto-container">
                    <div className="row clearfix">
                        <div className="col-lg-8 col-md-12 col-sm-12 content-side">
                            <div className="tour-details-content">
                                <div className="inner-box">
                                    <div className="text">
                                        <h2>M?? t???</h2>
                                        <p dangerouslySetInnerHTML={{__html: `${tour.description}`}} />
                                        <ul className="info-list clearfix">
                                            <li><i className="far fa-clock"></i>{tour.duration}</li>
                                            <li><i className="far fa-user"></i>??ang c???p nh???t</li>
                                            <li><i className="far fa-map"></i>??ang c???p nh???t</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="overview-inner">
                                    <ul className="overview-list clearfix">
                                        <li><span>C??n:</span>{tour.slot} xu???t</li>
                                        <li><span>??i???m kh???i h??nh:</span>{tour.departure}</li>
                                        <li><span>Th???i gian kh???i h??nh:</span>{tour.depart_date}</li>
                                    </ul>
                                </div>
                                <div className="tour-plan">
                                    <div className="text">
                                        <h2>K??? ho???ch tour</h2>
                                        <p dangerouslySetInnerHTML={{__html: `${tour.plan_tour}`}} />
                                    </div>
                                </div>
                                {/* <div className="photo-gallery">
                                    <div className="text">
                                        <Link className="photo-gallery-link" to={"/tour-detail/" + tourId + "/gallery"}>
                                            B??? s??u t???p ???nh <span> </span>
                                            <i className="fas fa-arrow-right"></i>
                                        </Link>
                                    </div>
                                </div> */}
                                <div className="comment-box">
                                    <div className="text">
                                        <h2>????nh gi??</h2>
                                        <Rating name="simple-controlled"
                                        size="large"
                                        value={rating}
                                        onChange={addRating}
                                        />
                                    </div>
                                    <div>
                                    <form onSubmit={addComment} className="comment-form">
                                        <div className="row clearfix">
                                            <div className="col-lg-12 col-md-12 col-sm-12 form-group">
                                                <textarea placeholder="N???i dung" value={comment} 
                                                    onChange={(event) => handleChange(event)}/>
                                            </div>
                                            <div className="col-lg-12 col-md-12 col-sm-12 form-group message-btn">
                                                <button type="submit" className="theme-btn">G???i</button>
                                            </div>
                                        </div>
                                    </form>
                                    </div>
                                    <hr />
                                    <div className="group-title">
                                        <h2>{listComment.length} B??nh lu???n</h2>
                                    </div>

                                    <div className="comment-box-content">
                                        {listComment.map(c => <CommentItem key={c.id} comment={c} />)}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-12 col-sm-12 sidebar-side">
                            <div className="default-sidebar tour-sidebar ml-20">
                                <div className="sidebar-widget downloads-widget">
                                    <div className="form-widget">
                                        <div className="widget-title">
                                            <h3>?????t Tour</h3>
                                        </div>
                                        <Link to={"/tour-detail/" + tourId + "/booking-1"} style={{ color: "#fff" }}>
                                            <button type="submit" className="theme-btn">Nh???n v??o ????y</button>
                                        </Link>
                                    </div>
                                    <div className="widget-title">
                                        <h3>T???i xu???ng</h3>
                                    </div>
                                    <div className="widget-content">
                                        <ul className="download-links clearfix">
                                            <li>
                                                <Link to="/">H?????ng d???n
                                                    <i className="fas fa-download"></i>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/">T??i li???u du l???ch
                                                    <i className="fas fa-download"></i>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/">Logo & N???i dung
                                                    <i className="fas fa-download"></i>
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="advice-widget">
                                    <div className="inner-box"
                                        style={{ backgroundImage: `url(${advice1})` }}>
                                        <div className="text">
                                            <h2>Gi???m <br />25% cho <br />c??c chuy???n ??i n???i ?????a</h2>
                                        </div>
                                    </div>
                                </div>
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
function CommentItem(props)  {

        return (
            <>
                <div className="comment">
                    <figure className="thumb-box">
                        <Avatar
                            alt="ImageComment"
                            src={props.comment.user.avatar}
                            sx={{ width: 52, height: 52 }}
                        />
                    </figure>
                    <div className="comment-inner">
                        <div className="comment-info clearfix">
                            <span className="post-date">{props.comment.created_date}</span>
                        </div>
                        <p>
                            {props.comment.content}
                        </p>
                        <div className="author-comment">
                            <span>B??nh lu???n b???i:</span> {props.comment.user.username}
                        </div>
                    </div>
                </div>
            </>
        )
    }
