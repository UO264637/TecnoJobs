import React from 'react';
import withRouter from '../withRouter';
import { Typography, PageHeader, Descriptions, Avatar, Row, Col } from 'antd';
import { Button } from 'antd';
import { ShoppingOutlined } from '@ant-design/icons';

class CompanyDetails extends React.Component {

    constructor(props) {
        super(props)
        this.id = this.props.params.id;
        this.state = {
          company : {}
        }
        this.getCompanyDetails();
    }

    getCompanyDetails = async () => {
      console.log(this.id);
      const { data, error } = await this.props.supabase
        .from('company')
        .select()
        .eq('id', this.id )

      if ( error == null && data.length > 0){
        // Data is a list
        this.setState({
          company : data[0]
        }) 
      }
    }


    render() { 
      const { Text } = Typography;
      let letter = "";
      if (this.state.company.name != undefined){
        letter=this.state.company.name.charAt(0);
      }
      return (
        <PageHeader title={ this.state.company.title } 
            ghost={false} onBack={() => window.history.back()}>
          <Row>
            <Col offset="2" span="4">
              <Avatar style={{ backgroundColor: "#FECBC1", color:"#000000" , marginTop: 12  }} size={100} >
                { letter }
              </Avatar>
            </Col>
            <Col span="18">
              <Descriptions title={ this.state.company.name }>
                <Descriptions.Item label="" span={3}>{ this.state.company.description }</Descriptions.Item>
                <Descriptions.Item label="Adress" span={2}>{ this.state.company.adress }</Descriptions.Item>
                <Descriptions.Item label="Employees">{ this.state.company.employees }</Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </PageHeader>
      )
    }
  }

  export default withRouter(CompanyDetails);