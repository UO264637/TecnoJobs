import React from 'react';
import { Link } from "react-router-dom"
import { Card, Col, Row, Badge, Typography, Paragraph } from 'antd';
import { Input, Tag } from 'antd';
class OfferList extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
          offers : [],
          filtered : [],
          skills: [],
          selectedTags: []
        }
        this.getOffersSummary();
        //this.getSkills();
    }

    getOffersSummary = async () => {
      const { data, error } = await this.props.supabase
        .from('offer')
        .select('*, company(name)')

      if ( error == null){
        data.map(offer => {offer.companyName = offer.company.name; delete offer.company});
        this.setState({
          offers : data,
          filtered: data
        }) 
      }
    }

    getSkills = async () => {
      const { data, error } = await this.props.supabase
        .from('skill')
        .select('*')
  
      if ( error == null){
        this.setState({
          skills : data
        }) 
      }
    }

    onSearch = async (value) => {
      let filteredOffers = [];
      this.state.offers.forEach(offer => {
        if (offer.title.toLowerCase().includes(value.toLowerCase()) || offer.description.toLowerCase().includes(value.toLowerCase())
        || offer.location.toLowerCase().includes(value.toLowerCase())) {
          filteredOffers.push(offer)
        }
      });

      this.setState({
        filtered : filteredOffers
      })
    }

    handleChange = async (tag, checked) => {
      let myTags = this.state.selectedTags;
      if (checked && !myTags.includes(tag))
      {
        myTags.push(tag);
      }
      else if (!checked) {
        const index = myTags.indexOf(tag);
        if (index > -1) { 
          myTags.splice(tag, 1);
        }
      }

      this.setState({
        selectedTags : myTags
      })

      const { data, error } = await this.props.supabase
        .from('skills_by_offer')
        .select('*')

        if ( error == null ){
          let filteredOffers = [];
          for (let i = 0; i < data.length; i++){
            if (this.state.selectedTags.includes(data[i].id)){
              this.state.filtered.forEach(offer => {
                if (offer.id == data[i].offer_id) {
                  filteredOffers.push(offer);
                }
              })
            }
          }

          this.setState({
            filtered : filteredOffers
          })
        }
        else{
          console.log(error)
        }
    };

  render() { 
    const { Search } = Input;
    const { Text } = Typography;
    return (
      <div>
        <Row justify="center">
        <Col xs={24} sm={22} md={20} lg={18} xl={16}>
          <Search
            placeholder="input search text"
            allowClear
            enterButton="Search"
            size="large"
            onSearch={this.onSearch}
          />
          <div>
              { this.state.skills.map( skill => {
                return (
                  <Tag.CheckableTag  key={skill.id} color={skill.color} checked={this.state.selectedTags.indexOf(skill.id) > -1}
                  onChange={(checked) => this.handleChange(skill.id, checked)}>
                    {skill.name}
                  </Tag.CheckableTag >) }
                )
              }
          </div>
          { this.state.filtered.map( offer => {
              offer.linkTo = "/offer/"+offer.id;
              if (offer.highlighted) {
                return(
                  <Link to={ offer.linkTo } >
                    <Badge.Ribbon text="Highlighted" color="#ff947f">
                      <Card hoverable key={offer.id} title={ offer.title } style={{ marginTop: 16 }}>
                        <Text strong >{ offer.companyName }</Text><br></br>
                        <Text >{ offer.location }</Text>
                        <Text strong style={{ fontSize:20, float: 'right'}}>{ offer.salary + "€" }</Text>
                      </Card>
                    </Badge.Ribbon>
                  </Link>
                )
              }
              else {
                return (
                  <Link to={ offer.linkTo } >
                    <Card hoverable key={offer.id} title={ offer.title } style={{ marginTop: 16 }}> 
                      <Text strong >{ offer.companyName }</Text><br></br>
                      <Text >{ offer.location }</Text>
                      <Text strong style={{ fontSize:20, float: 'right'}}>{ offer.salary + "€" }</Text>
                    </Card>
                  </Link>
                )
              }
          })}
        </Col>
        </Row>
      </div>
    )
  }
}

export default OfferList;
