import React from 'react';
import withRouter from '../withRouter';
import { Button, InputNumber, Form, Input } from 'antd';
import { Card, Tag, Result } from 'antd';
import { useState, useEffect, useRef } from "react";
import { useParams } from 'react-router-dom';

class OfferEditForm extends React.Component {

  constructor(props) {
    super(props)
    this.id = this.props.params.id;
    this.state = {
      updatedOffer: false,
      title : "",
      description : "",
      salary : "",
      skills: [],
      offerSkills: [],
    }
    this.getOfferDetails();
    this.getSkills();
    this.onInputchange = this.onInputchange.bind(this);
  }

  onInputchange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  async getOfferDetails(){

    const { data: { user } } = await this.props.supabase.auth.getUser();
  
    const { data, error } = await this.props.supabase
      .from('offer')
      .select('*')
      .eq('id', this.id )
  
    if ( error == null && data.length > 0){
      //console.log(data[0])
      this.setState({
        title : data[0].title,
        description : data[0].description,
        salary : data[0].salary,
        workday : data[0].workday,
        location : data[0].location
      }) 

      const { data:data1, error1 } = await this.props.supabase
        .from('skills_by_offer')
        .select('*')
        .eq('offer_id', this.id )
                   

        if ( error1 == null ){
          console.log(data1)
          this.setState({
            offerSkills : data1
          }) 
        }
        else{
          console.log(error)
        }
    }
    else{
      console.log(error);
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

  addSkill = async (skill) => {
    let mySkills = this.state.offerSkills;
    if (!mySkills.includes(skill))
    {
      mySkills.push(skill);
    }

    this.setState({
      offerSkills : mySkills
    }) 
  }

  removeSkill = async (skill) => {
    let mySkills = this.state.offerSkills;
    const index = mySkills.indexOf(skill);
    if (index > -1) { 
      mySkills.splice(index, 1);
    }

    this.setState({
      offerSkills : mySkills
    }) 
  }

  async updateOffer (value) {
    const { data: { user } } = await this.props.supabase.auth.getUser();
    console.log(this.state)
    const { data, error } = await this.props.supabase
      .from('offer')
      .update({ 
        title: this.state.title,
        description : this.state.description,
        salary : this.state.salary,
        workday : this.state.workday,
        location : this.state.location
      })
      .eq('id', this.id)
      .select()
  
      if ( error == null){
        for (let i=0; i < this.state.offerSkills.length; i++) 
        {
          const { data2, error } = await this.props.supabase
            .from('offer_skill')
            .insert([
            { 
              offer_id: data[0].id,
              skill_id: this.state.offerSkills[i].id
            }])
        }
        
        this.setState({
          updatedOffer : true
        })
      }
      else {
        console.log(error)
      }
  }

  render() {
    if (this.state.updatedOffer){
      return ( 
        <Result
        status="success" title="Offer Updated"
        subTitle="Your offer is ready for everyone."
        extra={[
          <Button type="primary" key="myOffersButton" href={"/userOffers"}>
            Go to my offers
          </Button>,
          <Button key="createOfferButton" href={"/offer/create"}>Create a new offer</Button>,
        ]}
      />)
    }
    let space = " ";
    return (
      <Card>
        <Form name="basic" labelCol={ {span: 24/3} } wrapperCol={{ span: 24/3}} 
          size="Large"
          onFinish={ values => this.updateOffer(values) } autoComplete="off">

          <Form.Item label="Title"
            rules={[ 
             { required: true,message: 'Please input a title!',},
             { max: 25, message: 'title must be maximum 25 characters.' },
            ]}>
            <Input name="title" value={ this.state.title } onChange={this.onInputchange}/>
          </Form.Item>

          <Form.Item label="Description"  
            rules={[
              { required: true, message: 'Please input a description!', },
              { max: 250, message: 'description must be maximum 250 characters.' },
            ]}>
            <Input.TextArea name="description" value={ this.state.description } onChange={this.onInputchange}/>
          </Form.Item>

          <Form.Item label="Salary"  
            rules={[
              { required: true, message: 'Please input a salary!', },
            ]}>
              <InputNumber prefix="€" name="salary" min={0} value={ this.state.salary } onChange={this.onInputchange}/>
          </Form.Item>

          <Form.Item label="Workday"
            rules={[
              { required: true, message: 'Please input a workday!', },
              { max: 25, message: 'workday must be maximum 25 characters.' },
            ]}>
            <Input name="workday"  value={ this.state.workday } onChange={this.onInputchange}/>
          </Form.Item>

          <Form.Item label="Location"
            rules={[
              { required: true, message: 'Please input a location!', },
              { max: 25, message: 'location must be maximum 25 characters.' },
            ]}>
            <Input name="location"  value={ this.state.location } onChange={this.onInputchange}/>
          </Form.Item>

          <Form.Item label="Skills"  name="skills">
            <pre>{space}
              { this.state.offerSkills.map( skill => {
                return (
                  <Tag color={skill.color} closable onClose={() => this.removeSkill(skill)}>
                    {skill.name}
                  </Tag>) }
                )
              }
            </pre>
              
            <div>
              { this.state.skills.map( skill => {
                return (
                  <Button type="primary" shape="round" size="small" key={skill.id} onClick={() => this.addSkill(skill)}
                  style={{ background: skill.color, borderColor: skill.color}}>{skill.name}</Button>
                )
              })}
            </div>
          </Form.Item>

          <Form.Item wrapperCol={{  xs: { offset: 0 }, sm: { offset: 8, span: 24/3 } }} >
            <Button type="primary" htmlType="submit"  block>Save Changes</Button>
          </Form.Item>
        </Form>
      </Card>
    )
  }
}

export default withRouter(OfferEditForm);