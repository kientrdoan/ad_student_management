"use client"

/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react"
import { Table, Button, Space, Input, Dropdown, Checkbox, Tag } from "antd"
import { SearchOutlined, SettingOutlined, EditOutlined, PlusOutlined, BookOutlined } from "@ant-design/icons"
import { useDispatch, useSelector } from "react-redux"
import { getAllMajorAction } from "../redux/actions/MajorAction"
import { getAllSubjectAction } from "../redux/actions/SubjectAction"
import { Link } from "react-router-dom"
import dayjs from "dayjs"

export default function Subject() {
  const dispatch = useDispatch()
  const majors = useSelector((state) => state.MajorReducer.majors)
  const subjects = useSelector((state) => state.SubjectReducer.subjects)
  const [searchText, setSearchText] = useState("")
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    code: true,
    name: true,
    credit: true,
    total_period: true,
    major: true,
    created_at: true,
    updated_at: true,
  })

  useEffect(() => {
    const loadData = async () => {
      await dispatch(getAllMajorAction())
      await dispatch(getAllSubjectAction())
    }
    loadData()
  }, [dispatch])

  const filteredData = subjects.filter((subject) => {
    const searchLower = searchText.toLowerCase()
    const major = majors.find((m) => String(m.id) === String(subject.major))
    return (
      subject.code?.toLowerCase().includes(searchLower) ||
      subject.name?.toLowerCase().includes(searchLower) ||
      subject.credit?.toString().includes(searchLower) ||
      major?.name?.toLowerCase().includes(searchLower)
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
        key: "code",
        label: (
          <Checkbox checked={visibleColumns.code} onChange={() => toggleColumn("code")}>
            Code
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
        key: "credit",
        label: (
          <Checkbox checked={visibleColumns.credit} onChange={() => toggleColumn("credit")}>
            Credit
          </Checkbox>
        ),
      },
      {
        key: "total_period",
        label: (
          <Checkbox checked={visibleColumns.total_period} onChange={() => toggleColumn("total_period")}>
            Total Period
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
    { title: "ID", dataIndex: "id", key: "id", width: 70, visible: visibleColumns.id },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      visible: visibleColumns.code,
      render: (code) => <Tag color="purple">{code}</Tag>,
      width: 120,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      visible: visibleColumns.name,
      width: 250,
    },
    {
      title: "Credit",
      dataIndex: "credit",
      key: "credit",
      visible: visibleColumns.credit,
      width: 80,
    },
    {
      title: "Total Period",
      dataIndex: "total_period",
      key: "total_period",
      visible: visibleColumns.total_period,
      width: 120,
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
      width: 180,
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => (date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "N/A"),
      visible: visibleColumns.created_at,
      width: 150,
    },
    {
      title: "Updated At",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (date) => (date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "N/A"),
      visible: visibleColumns.updated_at,
      width: 150,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Link to={`/subjects/detail/${record.id}`}>
          <Button type="link" icon={<EditOutlined />} className="text-indigo-600">
            {/* Edit */}
          </Button>
        </Link>
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
              <BookOutlined className="text-indigo-600 text-lg" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Subjects</h1>
              <p className="text-sm text-gray-500">Manage subject information and curriculum</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6 gap-4 flex-shrink-0">
          <Link to="/subjects/detail">
            <Button type="primary" icon={<PlusOutlined />} size="large" className="shadow-sm">
              Add Subject
            </Button>
          </Link>

          <Space size="middle">
            <Input
              placeholder="Search subjects..."
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
              showTotal: (total) => `Total ${total} subjects`,
            }}
            // scroll={{ x: "max-content", y: "calc(100vh - 400px)" }}
          />
        </div>
      </div>
    </div>
  )
}
