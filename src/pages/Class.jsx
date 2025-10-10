"use client"

import { useEffect, useState } from "react"
import { Table, Button, Modal, Form, Input, Select, Space, message, Dropdown, Checkbox, Tag } from "antd"
import { SearchOutlined, SettingOutlined, EditOutlined, PlusOutlined, UsergroupAddOutlined } from "@ant-design/icons"
import { useDispatch, useSelector } from "react-redux"
import { getAllMajorAction } from "../redux/actions/MajorAction"
import { addClassAction, editClassAction, getAllClassAction } from "../redux/actions/ClassAction"
import dayjs from "dayjs"

export default function Class() {
  const dispatch = useDispatch()
  const majors = useSelector((state) => state.MajorReducer.majors)
  const classes = useSelector((state) => state.ClassReducer.classes)

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingRecord, setEditingRecord] = useState(null)
  const [form] = Form.useForm()
  const [searchText, setSearchText] = useState("")
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    name: true,
    major: true,
    start_year: true,
    end_year: true,
    created_at: true,
    updated_at: true,
  })

  useEffect(() => {
    const loadData = async () => {
      await dispatch(getAllMajorAction())
      await dispatch(getAllClassAction())
    }
    loadData()
  }, [dispatch])

  const showAddModal = () => {
    setEditingRecord(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const showEditModal = (record) => {
    setEditingRecord(record)
    form.setFieldsValue({
      name: record.name,
      major: record.major,
      start_year: record.start_year,
      end_year: record.end_year,
    })
    setIsModalVisible(true)
  }

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      let res
      if (editingRecord) {
        res = await dispatch(editClassAction(editingRecord.id, { ...editingRecord, ...values }))
      } else {
        console.log("Add class:", values)
        res = await dispatch(addClassAction(values))
      }
      if (res?.success) {
        message.success(`${editingRecord ? "Update" : "Add"} class successfully!`)
        dispatch(getAllClassAction())
        setIsModalVisible(false)
      } else {
        message.error("Action failed!")
      }
    } catch (err) {
      console.log("Validate Failed:", err)
    }
  }

  const filteredData = classes.filter((cls) => {
    const searchLower = searchText.toLowerCase()
    const major = majors.find((m) => String(m.id) === String(cls.major))
    return (
      cls.name?.toLowerCase().includes(searchLower) ||
      major?.name?.toLowerCase().includes(searchLower) ||
      cls.start_year?.toString().includes(searchLower) ||
      cls.end_year?.toString().includes(searchLower)
    )
  })

  const toggleColumn = (columnKey) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [columnKey]: !prev[columnKey],
    }))
  }

  const columnMenu = {
    items: [
      {
        key: "id",
        label: (
          <Checkbox checked={visibleColumns.id} onChange={() => toggleColumn("id")}>
            ID
          </Checkbox>
        ),
      },
      {
        key: "name",
        label: (
          <Checkbox checked={visibleColumns.name} onChange={() => toggleColumn("name")}>
            Name
          </Checkbox>
        ),
      },
      {
        key: "major",
        label: (
          <Checkbox checked={visibleColumns.major} onChange={() => toggleColumn("major")}>
            Major
          </Checkbox>
        ),
      },
      {
        key: "start_year",
        label: (
          <Checkbox checked={visibleColumns.start_year} onChange={() => toggleColumn("start_year")}>
            Start Year
          </Checkbox>
        ),
      },
      {
        key: "end_year",
        label: (
          <Checkbox checked={visibleColumns.end_year} onChange={() => toggleColumn("end_year")}>
            End Year
          </Checkbox>
        ),
      },
      {
        key: "created_at",
        label: (
          <Checkbox checked={visibleColumns.created_at} onChange={() => toggleColumn("created_at")}>
            Created At
          </Checkbox>
        ),
      },
      {
        key: "updated_at",
        label: (
          <Checkbox checked={visibleColumns.updated_at} onChange={() => toggleColumn("updated_at")}>
            Updated At
          </Checkbox>
        ),
      },
    ],
  }

  const allColumns = [
    { title: "ID", dataIndex: "id", key: "id", visible: visibleColumns.id, width: 70 },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      visible: visibleColumns.name,
      render: (name) => <Tag color="blue">{name}</Tag>,
      width: 150,
    },
    {
      title: "Major",
      dataIndex: "major",
      key: "major",
      render: (id) => {
        const major = majors.find((m) => String(m.id) === String(id))
        return major ? major.name : "N/A"
      },
      visible: visibleColumns.major,
      width: 200,
    },
    {
      title: "Start Year",
      dataIndex: "start_year",
      key: "start_year",
      visible: visibleColumns.start_year,
      width: 110,
    },
    {
      title: "End Year",
      dataIndex: "end_year",
      key: "end_year",
      visible: visibleColumns.end_year,
      width: 110,
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (text) => (text ? dayjs(text).format("DD/MM/YYYY HH:mm") : "N/A"),
      visible: visibleColumns.created_at,
      width: 150,
    },
    {
      title: "Updated At",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (text) => (text ? dayjs(text).format("DD/MM/YYYY HH:mm") : "N/A"),
      visible: visibleColumns.updated_at,
      width: 150,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button type="link" icon={<EditOutlined />} onClick={() => showEditModal(record)} className="text-indigo-600">
          {/* Edit */}
        </Button>
      ),
      visible: true,
      fixed: "right",
      width: 100,
    },
  ]

  const columns = allColumns.filter((col) => col.visible)

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col h-full">
        <div className="mb-6 flex-shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
              <UsergroupAddOutlined className="text-indigo-600 text-lg" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Classes</h1>
              <p className="text-sm text-gray-500">Manage class information and schedules</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6 gap-4 flex-shrink-0">
          <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal} size="large" className="shadow-sm">
            Add Class
          </Button>

          <Space size="middle">
            <Input
              placeholder="Search classes..."
              prefix={<SearchOutlined className="text-gray-400" />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 320 }}
              size="large"
              allowClear
              className="rounded-lg"
            />
            <Dropdown menu={columnMenu} trigger={["click"]}>
              <Button icon={<SettingOutlined />} size="large" className="rounded-lg">
                Columns
              </Button>
            </Dropdown>
          </Space>
        </div>

        <div className="flex-1 overflow-hidden">
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey={(r) => r.id}
            bordered
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} classes`,
            }}
            // scroll={{ x: "max-content", y: "calc(100vh - 400px)" }}
          />
        </div>
      </div>

      <Modal
        title={editingRecord ? "Edit Class" : "Add Class"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        okText="Save"
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Class Name" name="name" rules={[{ required: true, message: "Please input class name!" }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Major" name="major" rules={[{ required: true, message: "Please select major!" }]}>
            <Select placeholder="Select major">
              {majors?.map((m) => (
                <Select.Option key={m.id} value={m.id}>
                  {m.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Start Year"
            name="start_year"
            rules={[{ required: true, message: "Please input start year!" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item label="End Year" name="end_year" rules={[{ required: true, message: "Please input end year!" }]}>
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
