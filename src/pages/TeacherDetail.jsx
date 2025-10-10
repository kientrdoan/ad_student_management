"use client"

import { useEffect } from "react"
import { Form, Input, Button, Select, Card, Space, DatePicker, message, Row, Col } from "antd"
import { UserOutlined, ArrowLeftOutlined } from "@ant-design/icons"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"
import dayjs from "dayjs"

import { addTeacherAction, editTeacherAction, getTeacherAction } from "../redux/actions/TeacherAction"
import { getAllAction } from "../redux/actions/DepartmentsAction"

export default function TeacherDetail() {
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const departments = useSelector((state) => state.DepartmentReducer.departments)

  const [messageApi, contextHolder] = message.useMessage()
  const { id } = useParams()

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getAllAction())

      if (id) {
        const res = await dispatch(getTeacherAction(id))
        if (res.success) {
          form.setFieldsValue({
            instructor_code: res.data.instructor_code,
            degree: res.data.degree,
            title: res.data.title,
            department: res.data.department,
            first_name: res.data.user?.first_name,
            last_name: res.data.user?.last_name,
            email: res.data.user?.email,
            phone: res.data.user?.phone,
            address: res.data.user?.address,
            identity_number: res.data.user?.identity_number,
            date_of_birth: res.data.user?.date_of_birth ? dayjs(res.data.user.date_of_birth) : null,
            gender: res.data.user?.gender === "M" ? "Nam" : "Nữ",
          })
        } else {
          messageApi.error("Không tìm thấy teacher!")
        }
      }
    }

    fetchData()
  }, [dispatch, id, form, messageApi])

  const handleSubmit = async (values) => {
    const payload = {
      instructor_code: values.instructor_code,
      degree: values.degree,
      title: values.title,
      department: values.department,
      user: {
        email: values.email,
        first_name: values.first_name,
        last_name: values.last_name,
        phone: values.phone,
        address: values.address,
        identity_number: values.identity_number,
        date_of_birth: values.date_of_birth ? values.date_of_birth.format("YYYY-MM-DD") : null,
        gender: values.gender === "Nam" ? "M" : "F",
        password: "12345",
        role: "TEACHER",
        is_active: true,
      },
    }

    if (id) {
      const res = await dispatch(editTeacherAction(id, payload))
      if (res.success) {
        messageApi.success("Cập nhật teacher thành công!")
        setTimeout(() => navigate("/teachers"), 1000)
      } else {
        messageApi.error("Thao tác thất bại!")
      }
    } else {
      const res = await dispatch(addTeacherAction(payload))
      if (res.success) {
        messageApi.success("Thêm teacher thành công!")
        setTimeout(() => navigate("/teachers"), 1000)
      } else {
        messageApi.error("Thao tác thất bại!")
      }
    }
  }

  return (
    <>
      {contextHolder}
      <div className="h-full overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/teachers")} className="mb-4">
              Back to Teachers
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                <UserOutlined className="text-indigo-600 text-xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{id ? "Edit Teacher" : "Add New Teacher"}</h1>
                <p className="text-sm text-gray-500">
                  {id ? "Update teacher information" : "Create a new teacher record"}
                </p>
              </div>
            </div>
          </div>

          <Card className="shadow-sm border border-gray-200">
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Teacher Information
                </h3>
                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item
                      label="Instructor Code"
                      name="instructor_code"
                      rules={[{ required: true, message: "Please input instructor code!" }]}
                    >
                      <Input placeholder="e.g. T20001" size="large" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="Degree" name="degree">
                      <Input placeholder="e.g. PhD, Master" size="large" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="Title" name="title">
                      <Input placeholder="e.g. Professor" size="large" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  label="Department"
                  name="department"
                  rules={[{ required: true, message: "Please select department!" }]}
                >
                  <Select placeholder="Select department" size="large">
                    {departments?.map((d) => (
                      <Select.Option key={d.id} value={d.id}>
                        {d.name || d.id}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Personal Information
                </h3>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="First Name"
                      name="first_name"
                      rules={[{ required: true, message: "Please input first name!" }]}
                    >
                      <Input placeholder="Enter first name" size="large" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Last Name"
                      name="last_name"
                      rules={[{ required: true, message: "Please input last name!" }]}
                    >
                      <Input placeholder="Enter last name" size="large" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[
                        { required: true, message: "Please input email!" },
                        { type: "email", message: "Invalid email!" },
                      ]}
                    >
                      <Input placeholder="Enter email" size="large" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Phone" name="phone" rules={[{ required: true, message: "Please input phone!" }]}>
                      <Input placeholder="Enter phone" size="large" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item label="Identity Number" name="identity_number">
                      <Input placeholder="ID/Passport" size="large" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="Date of Birth" name="date_of_birth">
                      <DatePicker style={{ width: "100%" }} size="large" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="Gender" name="gender">
                      <Select placeholder="Select gender" size="large">
                        <Select.Option value="Nam">Male</Select.Option>
                        <Select.Option value="Nữ">Female</Select.Option>
                        <Select.Option value="Khác">Other</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item label="Address" name="address">
                  <Input.TextArea rows={2} placeholder="Enter address" />
                </Form.Item>
              </div>

              <Form.Item className="mb-0">
                <Space size="middle">
                  <Button type="primary" htmlType="submit" size="large">
                    {id ? "Update Teacher" : "Create Teacher"}
                  </Button>
                  <Button size="large" onClick={() => navigate("/teachers")}>
                    Cancel
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>
    </>
  )
}
