"use client"

/* eslint-disable no-unused-vars */
import { useEffect } from "react"
import { Form, Input, InputNumber, Select, Button, Card, message, Row, Col } from "antd"
import { BookOutlined, ArrowLeftOutlined } from "@ant-design/icons"
import { useDispatch, useSelector } from "react-redux"
import { getAllMajorAction } from "../redux/actions/MajorAction"
import { addSubjectAction, editSubjectAction, getSubjectAction } from "../redux/actions/SubjectAction"
import { useParams, useNavigate } from "react-router-dom"

export default function SubjectDetail() {
  console.log("[v0] SubjectDetail component is rendering")

  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const majors = useSelector((state) => state.MajorReducer.majors)
  const [messageApi, contextHolder] = message.useMessage()
  const { id } = useParams()

  console.log("[v0] SubjectDetail - Route ID:", id)

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getAllMajorAction())

      if (id) {
        const res = await dispatch(getSubjectAction(id))
        if (res?.data) {
          form.setFieldsValue({
            code: res.data.code,
            name: res.data.name,
            credit: res.data.credit,
            description: res.data.description,
            total_period: res.data.total_period,
            // theory_period: res.data.theory_period,
            // lab_period: res.data.lab_period,
            major: res.data.major,
          })
        } else {
          messageApi.error("Không tìm thấy môn học!")
        }
      }
    }
    fetchData()
  }, [dispatch, id, form, messageApi])

  const handleSubmit = async (values) => {
    let res
    if (id) {
      res = await dispatch(editSubjectAction(id, values))
    } else {
      res = await dispatch(addSubjectAction(values))
    }

    if (res?.success) {
      messageApi.success(id ? "Cập nhật môn học thành công!" : "Thêm môn học thành công!")
      setTimeout(() => navigate("/subjects"), 1000)
    } else {
      messageApi.error("Thao tác thất bại!")
    }
  }

  return (
    <>
      {contextHolder}
      <div className="h-full overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/subjects")} className="mb-4">
              Back to Subjects
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                <BookOutlined className="text-indigo-600 text-xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{id ? "Edit Subject" : "Add New Subject"}</h1>
                <p className="text-sm text-gray-500">{id ? "Update subject information" : "Create a new subject"}</p>
              </div>
            </div>
          </div>

          <Card className="shadow-sm border border-gray-200">
            <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ credit: 3 }}>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Basic Information
                </h3>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Subject Code"
                      name="code"
                      rules={[{ required: true, message: "Please input subject code!" }]}
                    >
                      <Input placeholder="e.g. CS101" size="large" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Subject Name"
                      name="name"
                      rules={[{ required: true, message: "Please input subject name!" }]}
                    >
                      <Input placeholder="e.g. Introduction to Programming" size="large" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Credit"
                      name="credit"
                      rules={[{ required: true, message: "Please input credit!" }]}
                    >
                      <InputNumber min={1} max={10} style={{ width: "100%" }} size="large" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Major" name="major" rules={[{ required: true, message: "Please select major!" }]}>
                      <Select placeholder="Select major" size="large">
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
                  <Input.TextArea rows={3} placeholder="Enter subject description..." />
                </Form.Item>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Period Information
                </h3>
                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item
                      label="Total Period"
                      name="total_period"
                      rules={[{ required: true, message: "Please input total period!" }]}
                    >
                      <InputNumber min={1} style={{ width: "100%" }} size="large" />
                    </Form.Item>
                  </Col>
                  {/* <Col span={8}>
                    <Form.Item
                      label="Theory Period"
                      name="theory_period"
                      rules={[{ required: true, message: "Please input theory period!" }]}
                    >
                      <InputNumber min={0} style={{ width: "100%" }} size="large" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      label="Lab Period"
                      name="lab_period"
                      rules={[{ required: true, message: "Please input lab period!" }]}
                    >
                      <InputNumber min={0} style={{ width: "100%" }} size="large" />
                    </Form.Item>
                  </Col> */}
                </Row>
              </div>

              <Form.Item className="mb-0">
                <Button type="primary" htmlType="submit" size="large" block>
                  {id ? "Update Subject" : "Create Subject"}
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>
    </>
  )
}
