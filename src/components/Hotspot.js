import React, { Component } from 'react';
import {iconicBuildingInfo} from '../@db/database';

class Hotspot extends Component {

	render() {
        const { details } = this.props;
        const info = iconicBuildingInfo[details.hotspot];
        
		return (
            <>
                <div className="modal-wrapper hotspot">
                    <div className="sub-content" style={{marginTop: '30px'}}>
                        <div className="wistia_responsive_padding" style={{padding:`${info.padding} 0 0 0`, position:"relative"}}>
                            <div className="wistia_responsive_wrapper" style={{height:"100%", left:"0", position:"absolute", top:0, width:"100%"}}>
                                <div className={`wistia_embed wistia_async_${info.index} videoFoam=true`} style={{height:"100%", position:"relative", width:"100%"}}>
                                    <div className="wistia_swatch" style={{height:"100%", left:0 , opacity:0, overflow:"hidden", position:"absolute", top:0, transition:"opacity 200ms", width:"100%"}}>
                                        <img src={`https://fast.wistia.com/embed/medias/${info.index}/swatch`} style={{filter:"blur(5px)", height:"100%", objectFit:"contain", width:"100%"}} alt="" aria-hidden="true" onload="this.parentNode.style.opacity=1;" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* (details.land === "home1" || details.land === "home2") && <>
                        <div className="title">{hotModalInfo[details.hotspot].title}</div>
                        <div className="sub-content">
                            <div className="description">{hotModalInfo[details.hotspot].content}</div>                       

                            <div className="image">
                                <img src={hotModalInfo[details.hotspot].img}></img>
                                <div className="game-menu-item">
                                    <div className="text">Learn more</div>
                                </div>
                            </div>
                        </div>
                    </> */}


                    <div className="close-hot" onClick={this.props.onClose}>
                        <i className="fa fa-close" style={{color: 'white'}}></i>
                    </div>
                </div>
            </>
		);
	}
}

export default Hotspot;