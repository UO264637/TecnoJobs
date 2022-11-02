import React from 'react';
import { Button, Typography } from 'antd';
import { Table, Col, Row } from 'antd';
import { notification } from 'antd';
import { Form, Input, Popconfirm, Tag } from 'antd';
import { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

const EditableContext = React.createContext(null);
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);
  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };
  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({
        ...record,
        ...values,
      });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };
  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};

export default function MyOffersTable(props) {
  const [dataSource, setDataSource] = useState([]);
  const [updatedData, setUpdatedData] = useState({});
  const [visits, setVisits] = useState(0);

  let getOffers = (user) => {
    if (user != null){
      return props.supabase
        .from('offer')
        .select('*, company( * )')
        .eq('company.user', user.email )
    }
  }

  useEffect(() => {
    let i = 0;
    props.supabase.auth.getUser()
    .then((data) => getOffers(data.data.user))
    .then((result) => {result.data.map(element => {element.key = i;i++;});
    setDataSource(result.data)});
  }, []);

  useEffect(() => {
    let visitsSum = 0;
    dataSource.forEach(offer => {
      visitsSum += offer.visits;
    });
    setVisits(visitsSum);
  }, [dataSource]);

  const updateOffers = () => {
    updatedData.map( async (offer) => {
      const { data, error } = await props.supabase
          .from('offer')
          .update({
            salary : offer.salary
          })
          .eq('id', offer.id)
          .select()
      if ( error != null ){
        console.log(error);
      }
    })
  }

  const handleDelete = async (key) => {
    const { data: { user } } = await props.supabase.auth.getUser();
    if (user != null){      
      const { data, error } = await props.supabase
        .from('offer')
        .delete()
        .match({ id: dataSource[key].id })
  
      if ( error == null){
        let i = 0;
        const newData = dataSource.filter((item) => item.key !== key);
        newData.map(element => {element.key = i;i++;});
        setDataSource(newData);

        notification.info({
          message: "Deleted Offer",
          duration: 3,
          description: 'Offer has been deleted',
        });
      }
    }
  };

  const handleHighlight = async (key) => {
    const { data: { user } } = await props.supabase.auth.getUser();
    if (user != null){      
      const { data, error } = await props.supabase
        .from('offer')
        .update({ 
          highlighted: true
        })
        .eq('id', dataSource[key].id)
        .select()
  
      if ( error == null){
        const newDataSource=[...dataSource]
        newDataSource[key]={...newDataSource[key], highlighted: true}
        // let updatedData = dataSource;
        // updatedData[key] = data[0];
        // console.log(updatedData);
        setDataSource(newDataSource);

        notification.info({
          message: "Highlighted Offer",
          duration: 3,
          description: 'Offer has been highlighted',
        });
      }
    }
  };
  const defaultColumns = [
    {
      title: 'Title',
      dataIndex: 'title',
      width: '30%',
    },
    {
      title: 'Workday',
      dataIndex: 'workday',
    },
    {
      title: 'Location',
      dataIndex: 'location',
    },
    {
      title: 'Salary',
      dataIndex: 'salary',
      editable: true,
    },
    {
      title: 'Visits',
      dataIndex: 'visits'
    },
    {
      title: 'Status',
      dataIndex: 'highlighted',
      render: (_, record) =>
        record.highlighted ? (
          <Tag color="volcano">
            Highlighted
          </Tag>
        ) : null,
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <div>
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
            <a>Delete</a>
          </Popconfirm>
          <Button type="link" href={"/edit/offer/"+record.id}>Edit</Button>
          <Button type="link" onClick={() => handleHighlight(record.key)} >Highlight</Button>
          </div>
        ) : null,
    },
  ];
  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setUpdatedData(newData);
    setDataSource(newData);
  };
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });
  return (
    <Row justify="center">
      <Col  xs={24} sm={22} md={20} lg={18} xl={16}>
        <Typography.Paragraph style={{ fontSize:20 }}>
        Total Visits {' '}<Typography.Text strong >{ visits }</Typography.Text>
        </Typography.Paragraph >
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={columns}
        />
        
        <Button type="primary" onClick={() => updateOffers()} block
        >Save Changes</Button>
        </Col>
      </Row>
  );
};


/*class MyOffersTable extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
          offers : []
        }
        this.getUserOffersForSell();
    }

    deleteOffer = async (id) => {
        const { data: { user } } = await this.props.supabase.auth.getUser();
        if (user != null){
            const { data, error } = await this.props.supabase
                .from('offer')
                .delete()
                .match({ id: id })
  
            if ( error == null){
                this.getUserOffersForSell();

                notification.info({
                  message: "Deleted Offer",
                  duration: 3,
                  description:
                    'Offer has been deleted',
                });
            }
        }
      }

      getUserOffersForSell = async () => {
        const { data: { user } } = await this.props.supabase.auth.getUser();

        if (user != null){
            const { data, error } = await this.props.supabase
                .from('offer')
                .select('*, company( * )')
                .eq('company.user', user.email )

            if ( error == null){
                this.setState({
                  offers : data
                }) 
            }
            else {
              console.log(error)
            }
        }
    }

    render() { 
      let columns = [
        { 
          title: 'title',
          dataIndex: 'title',
        },
        { 
          title: 'description',
          dataIndex: 'description',
        },
        { 
          title: 'salary',
          dataIndex: 'salary',
        },
        { 
          title: 'Actions',
          dataIndex: 'id',
          render: id =>
            <div>
              <Button type="link" onClick={() => this.deleteOffer(id)} >Delete</Button>
              <Button type="link" href={"/edit/offer/"+id}>Edit</Button>
            </div> ,
        },

      ]

      let data = this.state.offers.map( element => { 
            element.key = "table"+element.id 
            return element;
      })    
  
      return (
          <Table columns={columns} dataSource={data} />
        )
      }
    }
    
    export default MyOffersTable;
  */