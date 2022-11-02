import React from 'react';
import { Button, InputNumber, Form, Input } from 'antd';
import { Card } from 'antd';
import { useState, useEffect, useRef } from "react";
import { useParams } from 'react-router-dom';
import { Avatar, Typography  } from 'antd';

class CompanyEditForm extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      name : "",
      description : "",
      adress : "",
      employees: ""
    }
    this.getCompanyDetails();
    this.onInputchange = this.onInputchange.bind(this);
  }

  onInputchange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  async getCompanyDetails(){

    const { data: { user } } = await this.props.supabase.auth.getUser();
  
    const { data, error } = await this.props.supabase
      .from('company')
      .select('*')
      .eq('user', user.email )
  
    if ( error == null && data.length > 0){
      //console.log(data[0])
      this.setState({
        name : data[0].name,
        description : data[0].description,
        adress : data[0].adress,
        employees : data[0].employees
      }) 
    }
    else{
      console.log(error);
    }
  }

  async updateCompany (value) {
    const { data: { user } } = await this.props.supabase.auth.getUser();
    console.log(this.state)
    const { data, error } = await this.props.supabase
      .from('company')
      .update({ 
        name: this.state.name,
        description : this.state.description,
        adress : this.state.adress,
        employees : this.state.employees
      })
      .eq('user', user.email)
      .select()
  
      if ( error == null && data != null){
        //offer = data;
      }
      else {
        console.log(error)
      }
  }

  render() {
    return (
      <Card>
        <Avatar style={{ backgroundColor: "#FECBC1", color:"#000000" , marginTop: 12  }} size={100} >
                      { this.state.name.charAt(0) }
        </Avatar>
        <Form name="basic" labelCol={ {span: 24/3} } wrapperCol={{ span: 24/3}} 
          size="Large"
          onFinish={ values => this.updateCompany(values) } autoComplete="off">

          <Form.Item label="Name"
            rules={[ 
             { required: true,message: 'Please input a name!',},
             { max: 25, message: 'name must be maximum 25 characters.' },
            ]}>
            <Input name="name" value={ this.state.name } onChange={this.onInputchange}/>
          </Form.Item>

          <Form.Item label="Description"  
            rules={[
              { required: true, message: 'Please input a description!', },
              { max: 250, message: 'description must be maximum 25 characters.' },
            ]}>
            <Input.TextArea name="description" value={ this.state.description } onChange={this.onInputchange}/>
          </Form.Item>

          <Form.Item label="Adress"  
            rules={[
              { required: true, message: 'Please input an adress!', },
              { max: 50, message: 'address must be maximum 50 characters.' },
            ]}>
              <Input name="adress"  value={ this.state.adress } onChange={this.onInputchange}/>
          </Form.Item>

          <Form.Item label="Employees"  
            rules={[
              { required: true, message: 'Please input an adress!', },
            ]}>
              <InputNumber name="employees" min={0} value={ this.state.employees } onChange={this.onInputchange}/>
          </Form.Item>

          <Form.Item wrapperCol={{  xs: { offset: 0 }, sm: { offset: 8, span: 24/3 } }} >
            <Button type="primary" htmlType="submit"  block>Save Changes</Button>
          </Form.Item>
        </Form>
      </Card>
    )
  }
}

export default CompanyEditForm;
