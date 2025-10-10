/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  message,
  Row,
  Col,
  Card,
  Spin,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getAllMajorAction } from "../redux/actions/MajorAction";
import {
  addSubjectAction,
  editSubjectAction,
  getSubjectAction,
} from "../redux/actions/SubjectAction";

export default function SubjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const majors = useSelector((state) => state.MajorReducer.majors);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getAllMajorAction());
        if (id) {
          setLoading(true);
          const res = await dispatch(getSubjectAction(id));
          if (res?.data) {
            form.setFieldsValue(res.data);
          }
        }
      } catch (err) {
        message.error("Failed to load subject data!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch, id]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      let res;
      if (id) {
        res = await dispatch(editSubjectAction(id, values));
      } else {
        res = await dispatch(addSubjectAction(values));
      }

      if (res?.success) {
        message.success(`${id ? "Updated" : "Added"} successfully!`);
        // navigate("/subjects");
      } else {
        message.error("Action failed!");
      }
    } catch (err) {
      message.error("An unexpected error occurred!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card
        title={id ? "Edit Subject" : "Add New Subject"}
        bordered={false}
        className="shadow-lg rounded-2xl w-full max-w-3xl"
      >
        <Spin spinning={loading}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{ credit: 3 }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Code"
                  name="code"
                  rules={[
                    { required: true, message: "Please input subject code!" },
                  ]}
                >
                  <Input placeholder="e.g. CS101" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[
                    { required: true, message: "Please input subject name!" },
                  ]}
                >
                  <Input placeholder="e.g. Introduction to Programming" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Credit"
                  name="credit"
                  rules={[
                    { required: true, message: "Please input credit!" },
                  ]}
                >
                  <InputNumber min={1} max={10} style={{ width: "100%" }} />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Major"
                  name="major"
                  rules={[
                    { required: true, message: "Please select major!" },
                  ]}
                >
                  <Select placeholder="Select major">
                    {majors?.map((m) => (
                      <Select.Option key={m.id} value={m.id}>
                        {m.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Description" name="description">
              <Input.TextArea
                rows={3}
                placeholder="Enter course description..."
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  label="Total Period"
                  name="total_period"
                  rules={[
                    {
                      required: true,
                      message: "Please input total period!",
                    },
                  ]}
                >
                  <InputNumber min={1} style={{ width: "100%" }} />
                </Form.Item>
              </Col>

              {/* <Col span={8}>
                <Form.Item
                  label="Theory Period"
                  name="theory_period"
                  rules={[
                    {
                      required: true,
                      message: "Please input theory period!",
                    },
                  ]}
                >
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  label="Lab Period"
                  name="lab_period"
                  rules={[
                    {
                      required: true,
                      message: "Please input lab period!",
                    },
                  ]}
                >
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col> */}
            </Row>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                className="rounded-xl"
              >
                {id ? "Update Subject" : "Add Subject"}
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Card>
    </div>
  );
}
