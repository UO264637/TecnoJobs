import React from 'react';
import LoginForm from './Components/LoginForm';
import CompaniesList from './Components/Company/CompaniesList';
import CompanyDetails from './Components/Company/CompanyDetails';
import OfferDetails from './Components/Offer/OfferDetails';
import CompanyEditForm from './Components/Company/CompanyEditForm';
import OfferCreateForm from './Components/Offer/OfferCreateForm';
import MyOffersTable from './Components/Offer/MyOffersTable';
import OfferEditForm from './Components/Offer/OfferEditForm';
import OfferList from './Components/Offer/OfferList';
import withRouter from './Components/withRouter';
import SignupForm from './Components/SingupForm';
import { createClient } from '@supabase/supabase-js'
import { Route, Routes, Link, Navigate } from "react-router-dom"
import { Layout, Menu } from 'antd';
import { Col, Row } from 'antd';
import { Avatar, Typography  } from 'antd';
import { FireOutlined , LoginOutlined } from '@ant-design/icons';

class App extends React.Component {

    constructor(props) {
      super(props)
  
      // opcional para poder personalizar diferentes aspectos
      const options = {
        schema: 'public',
        headers: { 'x-my-custom-header': 'my-app-name' },
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    
      const supabase = createClient(
        'https://feogfnusftjnqyppnpau.supabase.co', 
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlb2dmbnVzZnRqbnF5cHBucGF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjY4Nzg1NzEsImV4cCI6MTk4MjQ1NDU3MX0.RLUSu4Bdf4RdSxfbi-Z1x6SPivzHVOXACNhoUqHRhDw',
        options
      )
    
      this.supabase = supabase;

      // Configuración Inicial del estado
      this.state = {
        user : null
      }
    }

    componentDidMount = async () => {
      if ( this.state.user == null){
        const { data: { user } } = await this.supabase.auth.getUser();

        if ( user != null ){
          this.setState({
            user : user
          })
        }
      }
    }

    callBackOnFinishLoginForm = async (loginUser) => {
        // logIn
        const { data, error } = await this.supabase.auth.signInWithPassword({
        email: loginUser.email,
        password: loginUser.password,
      })
      
      if ( error == null && data.user != null ){
        this.setState({
          user : data.user
        })

        this.props.navigate("/userItems");
      }  
    }

  callBackOnFinishSignupForm = async (loginUser) => {
      // signUp, Create user
      const { data, error } = await this.supabase.auth.signUp({
      email: loginUser.email,
      password: loginUser.password,
    })

    if ( error == null && data.user != null ){
      console.log("a");
      const { data, error } = await this.supabase
        .from('company')
        .insert([
          { 
            name: loginUser.name,
            adress: loginUser.adress,
            description: loginUser.description,
            user: loginUser.email
          }
        ])

        if (error != null){
          console.log(error);
        } else {
          this.setState({
            createdCompany : true
          }) 
        }  
    }
  }
  

    protectedRoute = (element) => {
      if (this.state.user == null) {
        return <Navigate to={"/"} replace />;
      }
      return element;
    };  

  render() {
    // for not using Layout.Header, Layout.Footer, etc...
    const { Header, Footer, Sider, Content } = Layout;
    const { Text } = Typography;

    let contentUser = <Text style={{ color:"#ffffff" }}>Login</Text>
    if ( this.state.user != null ){
      contentUser = <a href="/edit/profile">
                      <Avatar style={{ backgroundColor: "#FECBC1", color:"#000000" , marginTop: 12  }} size="large" >
                        { this.state.user.email.charAt(0) }
                      </Avatar>
                    </a>
    }
    else {
      let rightMenuItems = [
      { key:"menuSignup",  label: <Link to="/signup">Sign up</Link>, icon: <FireOutlined />},
      { key:"menuLogin",  label: <Link to="/">Login</Link>, icon: <LoginOutlined/>}]

      contentUser = <Menu theme="dark" mode="horizontal" items={ rightMenuItems } >
      </Menu>
    }

    let menuItems = [
      { key:"logo",  label: <img src="/logo.png" width="40" height="40"/>},
      { key:"menuOffers",  label: <Link to="/offers">Offers</Link>, icon: <FireOutlined />},
      { key:"auth_createOffer",  label: <Link to="/offer/create">Offer Job</Link> },
      { key:"auth_userOffers",  label: <Link to="/userOffers">My offers</Link> },
      ]

    if (this.state.user == null){
      menuItems = menuItems.filter( element => !element.key.startsWith("auth") );
    }

    return (
      <Layout className="layout">
        <Header>
          <Row>
            <Col span="12">
              <Menu theme="dark" mode="horizontal" items={ menuItems } >
              </Menu>
            </Col>
            <Col span="12" style={{display: 'flex', flexDirection: 'row-reverse' }}>
              { contentUser }
            </Col>
          </Row>
        </Header>
  
        <Content style={{ padding: '0 50px' }}>
          <div className="site-layout-content">
            <Row style={{ marginTop: 34 }}>
              <Col span={24}>
                <Routes>
                  <Route path="/" element={ 
                    <LoginForm callBackOnFinishLoginForm  = { this.callBackOnFinishLoginForm } /> 
                    } />
                    <Route path="/signup" element={ 
                      <SignupForm callBackOnFinishSignupForm = { this.callBackOnFinishSignupForm } /> 
                    } />
                  <Route path="/companies" element={ 
                    <CompaniesList supabase={this.supabase} /> 
                  } />
                  <Route path="/offers" element={ 
                    <OfferList supabase={this.supabase} /> 
                  } />
                  <Route path="/offer/:id" element={ 
                    <OfferDetails supabase={this.supabase}/> 
                  } />
                  <Route path="/company/:id" element={ 
                    <CompanyDetails supabase={this.supabase}/> 
                  } />
                  <Route path="/offer/create" element={ 
                    this.protectedRoute(<OfferCreateForm supabase={this.supabase}/>)
                  } />
                  <Route path="/userOffers" element={ 
                    <MyOffersTable supabase={this.supabase}/> 
                  } />
                  <Route path="/edit/offer/:id" element={ 
                    <OfferEditForm supabase={this.supabase}/> 
                  } />
                  <Route path="/edit/profile" element={ 
                    <CompanyEditForm supabase={this.supabase}/> 
                  } />
                </Routes>
              </Col>
            </Row>
          </div>
        </Content>
          
        <Footer style={{ textAlign: 'center' }}> TecnoJobs </Footer>
      </Layout>
    );
  }
}

export default withRouter(App);
