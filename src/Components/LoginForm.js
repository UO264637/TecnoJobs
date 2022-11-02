
import React from 'react';
import { Button, Form, Input } from 'antd';
import { Card } from 'antd';

class LoginForm extends React.Component {

    sendLogin(values){
      this.props.callBackOnFinishLoginForm({
        email: values.email,
        password : values.password,
      });
    }
  
    render() {
      return (
        <div>
          <Card>
            <Form name="basic" labelCol={{span: 24/3}} wrapperCol={{ span: 24/3}} 
              initialValues={{remember: true,}}
              onFinish={ values => this.sendLogin(values) } autoComplete="off">

              <Form.Item label="Email" name="email"
                rules={[ 
                  { required: true,message: 'Please input your username!',},
                ]}>
                <Input />
              </Form.Item>

              <Form.Item label="Password"  name="password"
                rules={[
                  { required: true, message: 'Please input your password!', },
                ]}>
                <Input.Password />
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

  export default LoginForm;
