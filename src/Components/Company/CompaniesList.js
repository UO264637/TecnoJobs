import React from 'react';
import { Link } from "react-router-dom"
import { Card, Col, Row } from 'antd';

class CompaniesList extends React.Component {

    constructor(props) {
        super(props)
        console.log("CompanieList Constructor")
        this.state = {
          companies : []
        }
        this.getCompaniesSummary();
    }

    getCompaniesSummary = async () => {
      const { data, error } = await this.props.supabase
        .from('company')
        .select('*')

      if ( error == null){
        this.setState({
          companies : data
        }) 
      }
    }

    render() { 
      return (
        <Row gutter={ [16, 16] } >
          { this.state.companies.map( company => {
              company.linkTo = "/company/"+company.id;
              let imagen = <img src={"/imageMockup.png"}  />
              return (
                <Col xs={24} sm={12} md={8} lg={4} xl={3} >
                    <Link to={ company.linkTo } >
                      <Card hoverable key={company.id} title={ company.name } 
                        cover={ imagen  }> 

                        { company.adress } 
                      </Card>
                    </Link>
                  </Col>  
              )
          })}
        </Row>
      )
    }
  }

  export default CompaniesList;
