
import React from 'react';
import { Button, Form, Input, InputNumber } from 'antd';
import { Card } from 'antd';

class SignupForm extends React.Component {

  sendSignup(values){
    this.props.callBackOnFinishSignupForm({
      email: values.email,
      password: values.password,
      name: values.name,
      description: values.description,
      adress: values.adress,
      employees: values.employees
    });
  }
  
    render() {
      return (
        <div>
          <Card>
            <Form name="basic" labelCol={{span: 24/3}} wrapperCol={{ span: 24/3}} 
              initialValues={{remember: true,}}
              onFinish={ values => this.sendSignup(values) } autoComplete="off">

              <Form.Item label="Email" name="email"
                rules={[ 
                  { required: true,message: 'Please input your username!',},
                  { max: 25, message: 'email must be maximum 25 characters.' },
                ]}>
                <Input />
              </Form.Item>

              <Form.Item label="Password"  name="password"
                rules={[
                  { required: true, message: 'Please input your password!', },
                  { max: 12, message: 'password must be maximum 12 characters.' },
                  { min: 5, message: 'email must be minimum 5 characters.' },
                ]}>
                <Input.Password />
              </Form.Item>

              <Form.Item label="Name"  name="name"
                rules={[
                  { required: true, message: 'Please input your company name!', },
                  { max: 25, message: 'name must be maximum 25 characters.' },
                ]}>
                <Input />
              </Form.Item>

              <Form.Item label="Adress"  name="adress"
                rules={[
                  { required: true, message: 'Please input your adress!', },
                  { max: 50, message: 'address must be maximum 25 characters.' },
                ]}>
                <Input />
              </Form.Item>

              <Form.Item label="Description"  name="description"
                rules={[
                  { required: true, message: 'Please input your company description!', },
                  { max: 250, message: 'description must be maximum 250 characters.' },
                ]}>
                <Input.TextArea />
              </Form.Item>

              <Form.Item label="Employees"  name="employees"
                rules={[
                  { required: true, message: 'Please input your company description!', },
                ]}>
                <InputNumber min={0} />
              </Form.Item>

              <Form.Item wrapperCol={{  xs: { offset: 0 }, sm: { offset: 8, span: 24/3 } }} >
                <Button type="primary" htmlType="submit" block>Submit</Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      )
    }
  }

  export default SignupForm;
