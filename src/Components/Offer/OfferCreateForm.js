import React from 'react';
import { Button, InputNumber, Form, Input } from 'antd';
import { Card, Tag } from 'antd';
import { Result, Typography  } from 'antd';

class OfferCreateForm extends React.Component {

  constructor(props) {
    super(props)
    this.file = null
    this.state = {
      createdOffer: false,
      skills: [],
      offerSkills: [],
    };
    this.getSkills()
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

  async sendCreateOffer(values){

    const { data: { user } } = await this.props.supabase.auth.getUser();
  
    if (user != null){
      const { data, error } = await this.props.supabase
        .from('offer')
        .insert([
        { 
          title: values.title, 
          description: values.description, 
          salary: values.salary,
          workday: values.workday,
          location: values.location,
          company_id: "1",
        }])
        .select()

      if (error != null){
        console.log(error);
      } else {
        for (let i=0; i < this.state.offerSkills.length; i++) 
        {
          const { data2, error } = await this.props.supabase
            .from('offer_skill')
            .insert([
            { 
              offer_id: data[0].id,
              skill_id: this.state.offerSkills[i].id
            }])
          console.log(error)
        }
        
        this.setState({
          createdOffer : true
        }) 
      }
    }
  }

  render() {
    if (this.state.createdOffer){
      return ( 
        <Result
        status="success" title="Offer Created"
        subTitle="Your offer is ready for everyone."
        extra={[
          <Button type="primary" key="myOffersButton" href={"/userOffers"}>
            Go to my offers
          </Button>,
          <Button key="createOfferButton" href={"/offer/create"}>Create another offer</Button>,
        ]}
      />)
    }

    let space = " ";
    return (
      <Card>
        <Form name="basic" labelCol={ {span: 24/3} } wrapperCol={{ span: 24/3}} 
          size="Large"
          onFinish={ values => this.sendCreateOffer(values) } autoComplete="off">

          <Form.Item label="Title" name="title"
            rules={[ 
              { required: true,message: 'Please input a title!',},
              { max: 25, message: 'title must be maximum 25 characters.' },
            ]}>
            <Input />
          </Form.Item>

          <Form.Item label="Description"  name="description"
            rules={[
              { required: true, message: 'Please input a description!', },
              { max: 250, message: 'description must be maximum 250 characters.' },
            ]}>
            <Input.TextArea />
          </Form.Item>

          <Form.Item label="Salary"  name="salary"
            rules={[
              { required: true, message: 'Please input a salary!', },
            ]}>
             <InputNumber min={0} />
             €
          </Form.Item>

          <Form.Item label="Workday"  name="workday"
            rules={[
              { required: true, message: 'Please input a workday!', },
              { max: 25, message: 'workday must be maximum 25 characters.' },
            ]}>
            <Input />
          </Form.Item>

          <Form.Item label="Location"  name="location"
            rules={[
              { required: true, message: 'Please input a location!', },
              { max: 25, message: 'location must be maximum 25 characters.' },
            ]}>
            <Input />
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
            <Button type="primary" htmlType="submit"  block>Offer Job</Button>
          </Form.Item>
        </Form>
      </Card>
    )
  }
}

  export default OfferCreateForm;
